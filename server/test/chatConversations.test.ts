import { afterAll, beforeAll, describe, expect, it } from "vitest";
import http from "http";
import type { AddressInfo } from "net";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import app from "../src/app";
import { env } from "../src/config/env";
import ChatConversation from "../src/models/chatConversation.model";

const TEST_SECRET = "test-secret"; // matches vitest.config.ts env.JWT_SECRET
const token = (id: string) => jwt.sign({ id, email: `${id}@chat.test.local` }, TEST_SECRET);

let server: http.Server;
let base = "";

beforeAll(async () => {
  await mongoose.connect(env.MONGODB_URI);
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
      resolve();
    });
  });
});

afterAll(async () => {
  await ChatConversation.deleteMany({ userId: /^chat-test-/ });
  await new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  await mongoose.disconnect();
});

const freshUser = (label: string) => {
  const id = `chat-test-${label}-${randomUUID()}`;
  return { id, headers: { authorization: `Bearer ${token(id)}`, "content-type": "application/json" } };
};

const sendChat = (
  headers: { authorization: string; "content-type": string },
  body: { message: string; conversationId?: string },
) => fetch(`${base}/api/chat`, { method: "POST", headers, body: JSON.stringify(body) });

describe("POST /api/chat persists a conversation", () => {
  it("creates a conversation on the first message and returns its id", async () => {
    const user = freshUser("create");
    const res = await sendChat(user.headers, { message: "What colours suit me?" });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(typeof body.conversationId).toBe("string");

    const stored = await ChatConversation.findById(body.conversationId).lean();
    expect(stored).toMatchObject({ userId: user.id, title: "What colours suit me?" });
    expect(stored?.messages).toHaveLength(2);
    expect(stored?.messages[0]).toMatchObject({ role: "user", content: "What colours suit me?" });
    expect(stored?.messages[1]).toMatchObject({ role: "assistant" });
  });

  it("appends to the same conversation on a second message, and keeps the original title", async () => {
    const user = freshUser("append");
    const first = await sendChat(user.headers, { message: "Hello there" });
    const { conversationId } = await first.json();

    const second = await sendChat(user.headers, { message: "Follow-up question", conversationId });
    expect(second.status).toBe(200);
    const secondBody = await second.json();
    expect(secondBody.conversationId).toBe(conversationId);

    const stored = await ChatConversation.findById(conversationId).lean();
    expect(stored?.title).toBe("Hello there");
    expect(stored?.messages).toHaveLength(4);
    expect(stored?.messages[2]).toMatchObject({ role: "user", content: "Follow-up question" });
  });

  it("404s on a conversationId that doesn't exist", async () => {
    const user = freshUser("missing");
    const res = await sendChat(user.headers, {
      message: "Hi",
      conversationId: new mongoose.Types.ObjectId().toString(),
    });
    expect(res.status).toBe(404);
  });

  it("404s on a conversationId that belongs to a different user", async () => {
    const owner = freshUser("owner");
    const stranger = freshUser("stranger");
    const created = await sendChat(owner.headers, { message: "My private chat" });
    const { conversationId } = await created.json();

    const res = await sendChat(stranger.headers, { message: "Trying to hijack this", conversationId });
    expect(res.status).toBe(404);

    // The stranger's message must not have been appended to the owner's conversation.
    const stored = await ChatConversation.findById(conversationId).lean();
    expect(stored?.messages).toHaveLength(2);
  });
});

describe("GET /api/chat/conversations", () => {
  it("lists only the signed-in user's own conversations, newest first, without message bodies", async () => {
    const user = freshUser("list");
    await sendChat(user.headers, { message: "First conversation" });
    await new Promise((r) => setTimeout(r, 5));
    const second = await sendChat(user.headers, { message: "Second conversation" });
    const { conversationId: secondId } = await second.json();

    const other = freshUser("list-other");
    await sendChat(other.headers, { message: "Someone else's chat" });

    const res = await fetch(`${base}/api/chat/conversations`, { headers: user.headers });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.conversations).toHaveLength(2);
    expect(body.conversations[0]).toMatchObject({ id: secondId, title: "Second conversation", messageCount: 2 });
    expect(body.conversations[0].messages).toBeUndefined();
  });

  it("401s when not signed in", async () => {
    const res = await fetch(`${base}/api/chat/conversations`);
    expect(res.status).toBe(401);
  });
});

describe("GET /api/chat/conversations/:id", () => {
  it("returns the full message list for the owner", async () => {
    const user = freshUser("detail");
    const created = await sendChat(user.headers, { message: "Show me the messages" });
    const { conversationId } = await created.json();

    const res = await fetch(`${base}/api/chat/conversations/${conversationId}`, { headers: user.headers });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.conversation.messages).toHaveLength(2);
    expect(body.conversation.messages[0]).toMatchObject({ role: "user", content: "Show me the messages" });
  });

  it("404s for a stranger", async () => {
    const owner = freshUser("detail-owner");
    const stranger = freshUser("detail-stranger");
    const created = await sendChat(owner.headers, { message: "Private" });
    const { conversationId } = await created.json();

    const res = await fetch(`${base}/api/chat/conversations/${conversationId}`, { headers: stranger.headers });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/chat/conversations/:id", () => {
  it("404s for a non-owner and leaves the conversation intact", async () => {
    const owner = freshUser("delete-owner");
    const stranger = freshUser("delete-stranger");
    const created = await sendChat(owner.headers, { message: "Do not delete me" });
    const { conversationId } = await created.json();

    const res = await fetch(`${base}/api/chat/conversations/${conversationId}`, {
      method: "DELETE",
      headers: stranger.headers,
    });
    expect(res.status).toBe(404);
    expect(await ChatConversation.findById(conversationId)).not.toBeNull();
  });

  it("deletes the conversation for its owner, and it disappears from the list", async () => {
    const user = freshUser("delete-owner-2");
    const created = await sendChat(user.headers, { message: "Delete this one" });
    const { conversationId } = await created.json();

    const res = await fetch(`${base}/api/chat/conversations/${conversationId}`, {
      method: "DELETE",
      headers: user.headers,
    });
    expect(res.status).toBe(200);
    expect(await ChatConversation.findById(conversationId)).toBeNull();

    const list = await fetch(`${base}/api/chat/conversations`, { headers: user.headers });
    const body = await list.json();
    expect(body.conversations.find((c: { id: string }) => c.id === conversationId)).toBeUndefined();
  });
});
