import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import http from "http";
import type { AddressInfo } from "net";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import app from "../src/app";
import { env } from "../src/config/env";
import Payment from "../src/models/payment.model";
import TryOnUsage from "../src/models/tryon.usage.model";

const TEST_SECRET = "test-secret"; // matches vitest.config.ts env.JWT_SECRET
const token = (id: string, email: string) => jwt.sign({ id, email }, TEST_SECRET);
const ADMIN_EMAIL = "admin@test.local"; // matches vitest.config.ts env.ADMIN_EMAILS
const adminToken = token("admin-id", ADMIN_EMAIL);

let server: http.Server;
let base = "";

beforeAll(async () => {
  await mongoose.connect(env.MONGODB_URI);
  // Mongoose builds indexes in the background after connecting; without
  // waiting for it here, the partial-unique UTR index (payment.model.ts)
  // might not exist yet when the very first test runs, and a duplicate UTR
  // that should 409 would be accepted instead.
  await Payment.init();
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
      resolve();
    });
  });
});

afterAll(async () => {
  await Payment.deleteMany({ email: /@payments\.test\.local$/ });
  await TryOnUsage.deleteMany({ email: /@payments\.test\.local$/ });
  await new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  await mongoose.disconnect();
});

afterEach(() => vi.restoreAllMocks());

const freshMember = (label: string) => {
  const email = `${label}-${randomUUID()}@payments.test.local`;
  return { email, headers: { authorization: `Bearer ${token(email, email)}`, "content-type": "application/json" } };
};

const submit = (
  auth: { authorization: string; "content-type": string },
  fields: { kind: "plan" | "topup"; planId?: string; topupQty?: number; utr: string; email: string },
) =>
  fetch(`${base}/api/payments`, { method: "POST", headers: auth, body: JSON.stringify(fields) });

describe("POST /api/payments", () => {
  it("submits a top-up request as pending, amount computed server-side", async () => {
    const member = freshMember("submit");
    const res = await submit(member.headers, { kind: "topup", topupQty: 1, utr: randomUUID(), email: member.email });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.payment).toMatchObject({ status: "pending", kind: "topup", amount: 5, email: member.email });
  });

  it("rejects a typed email that doesn't match the signed-in account", async () => {
    const member = freshMember("wrong-email");
    const res = await submit(member.headers, { kind: "topup", utr: randomUUID(), email: "someone-else@example.com" });
    expect(res.status).toBe(400);
  });

  it("rejects a submission with no email", async () => {
    const member = freshMember("no-email");
    const res = await fetch(`${base}/api/payments`, {
      method: "POST",
      headers: member.headers,
      body: JSON.stringify({ kind: "topup", utr: randomUUID() }),
    });
    expect(res.status).toBe(400);
  });

  it("refuses a second pending request of the same kind while one is still open", async () => {
    const member = freshMember("dupe-pending");
    const first = await submit(member.headers, { kind: "topup", utr: randomUUID(), email: member.email });
    expect(first.status).toBe(201);
    const second = await submit(member.headers, { kind: "topup", utr: randomUUID(), email: member.email });
    expect(second.status).toBe(409);
  });

  it("refuses a UTR that is already attached to a live request", async () => {
    const utr = randomUUID();
    const a = freshMember("utr-a");
    const b = freshMember("utr-b");
    const first = await submit(a.headers, { kind: "topup", utr, email: a.email });
    expect(first.status).toBe(201);
    const replay = await submit(b.headers, { kind: "topup", utr, email: b.email });
    expect(replay.status).toBe(409);
  });
});

describe("admin review", () => {
  it("blocks a non-admin from listing, approving, or rejecting", async () => {
    const member = freshMember("not-admin");
    const submitted = await submit(member.headers, { kind: "topup", utr: randomUUID(), email: member.email });
    const { payment } = await submitted.json();

    const list = await fetch(`${base}/api/payments`, { headers: member.headers });
    expect(list.status).toBe(403);

    const approve = await fetch(`${base}/api/payments/${payment.id}/approve`, {
      method: "POST",
      headers: member.headers,
    });
    expect(approve.status).toBe(403);

    const reject = await fetch(`${base}/api/payments/${payment.id}/reject`, {
      method: "POST",
      headers: member.headers,
    });
    expect(reject.status).toBe(403);
  });

  it("approving a top-up raises the buyer's try-on limit, and a second approve 409s", async () => {
    const member = freshMember("approve-topup");
    await TryOnUsage.create({ email: member.email, count: 0, plan: "starter", limit: env.TRY_ON_LIMIT_STARTER, unlimited: false });

    const submitted = await submit(member.headers, { kind: "topup", topupQty: 3, utr: randomUUID(), email: member.email });
    const { payment } = await submitted.json();

    const approve = await fetch(`${base}/api/payments/${payment.id}/approve`, {
      method: "POST",
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(approve.status).toBe(200);

    const usage = await TryOnUsage.findOne({ email: member.email }).lean();
    expect(usage?.limit).toBe(env.TRY_ON_LIMIT_STARTER + 3);

    const secondApprove = await fetch(`${base}/api/payments/${payment.id}/approve`, {
      method: "POST",
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(secondApprove.status).toBe(409);
  });

  it("approving an Essentials plan sets the plan and grants a fresh allowance", async () => {
    const member = freshMember("approve-plan");
    const submitted = await submit(member.headers, { kind: "plan", planId: "essentials", utr: randomUUID(), email: member.email });
    const { payment } = await submitted.json();

    const approve = await fetch(`${base}/api/payments/${payment.id}/approve`, {
      method: "POST",
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(approve.status).toBe(200);

    const usage = await TryOnUsage.findOne({ email: member.email }).lean();
    expect(usage).toMatchObject({ plan: "essentials", limit: env.TRY_ON_LIMIT_ESSENTIALS, unlimited: false, count: 0 });
  });

  it("rejects with a reason and does not touch the quota", async () => {
    const member = freshMember("reject");
    await TryOnUsage.create({ email: member.email, count: 4, plan: "starter", limit: env.TRY_ON_LIMIT_STARTER, unlimited: false });
    const submitted = await submit(member.headers, { kind: "topup", utr: randomUUID(), email: member.email });
    const { payment } = await submitted.json();

    const reject = await fetch(`${base}/api/payments/${payment.id}/reject`, {
      method: "POST",
      headers: { authorization: `Bearer ${adminToken}`, "content-type": "application/json" },
      body: JSON.stringify({ reason: "Screenshot unreadable" }),
    });
    expect(reject.status).toBe(200);
    const body = await reject.json();
    expect(body.payment).toMatchObject({ status: "rejected", rejectionReason: "Screenshot unreadable" });

    const usage = await TryOnUsage.findOne({ email: member.email }).lean();
    expect(usage?.limit).toBe(env.TRY_ON_LIMIT_STARTER);
    expect(usage?.count).toBe(4);
  });

  it("lets the same UTR be resubmitted after a rejection", async () => {
    const member = freshMember("resubmit");
    const utr = randomUUID();
    const first = await submit(member.headers, { kind: "topup", utr, email: member.email });
    const { payment } = await first.json();
    await fetch(`${base}/api/payments/${payment.id}/reject`, {
      method: "POST",
      headers: { authorization: `Bearer ${adminToken}` },
    });

    const second = await submit(member.headers, { kind: "topup", utr, email: member.email });
    expect(second.status).toBe(201);
  });
});

describe("GET /api/payments/:id", () => {
  it("is readable by the owner and by an admin, but not by a stranger", async () => {
    const member = freshMember("record-owner");
    const stranger = freshMember("record-stranger");
    const submitted = await submit(member.headers, { kind: "topup", utr: randomUUID(), email: member.email });
    const { payment } = await submitted.json();

    const asOwner = await fetch(`${base}/api/payments/${payment.id}`, { headers: member.headers });
    expect(asOwner.status).toBe(200);

    const asAdmin = await fetch(`${base}/api/payments/${payment.id}`, {
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(asAdmin.status).toBe(200);

    const asStranger = await fetch(`${base}/api/payments/${payment.id}`, { headers: stranger.headers });
    expect(asStranger.status).toBe(403);
  });
});
