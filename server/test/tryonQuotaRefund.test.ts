import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import http from "http";
import type { AddressInfo } from "net";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import app from "../src/app";
import { env } from "../src/config/env";
import YouCamService from "../src/services/youcam.service";
import TryOnUsage from "../src/models/tryon.usage.model";

// Real quota service against a real Mongo connection (not mocked, unlike
// tryonHair.test.ts) — this file exists specifically to prove the business
// rule: a click only ever costs quota when it produces a real image.
const TEST_SECRET = "test-secret"; // matches vitest.config.ts env.JWT_SECRET

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
  await TryOnUsage.deleteMany({ email: /@quota-refund\.test\.local$/ });
  await new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  await mongoose.disconnect();
});

afterEach(() => vi.restoreAllMocks());

const freshMember = () => {
  const email = `member-${randomUUID()}@quota-refund.test.local`;
  return { email, token: jwt.sign({ id: email, email }, TEST_SECRET) };
};

const postClothes = (token: string) =>
  fetch(`${base}/api/tryon/clothes`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      personImageUrl: "https://images.example.com/member.jpg",
      garmentImageUrl: "https://images.example.com/garment.jpg",
    }),
  });

describe("try-on quota: only a real image costs a try-on", () => {
  it("does not consume quota when the provider call fails and the response falls back", async () => {
    vi.spyOn(YouCamService, "tryOnClothes").mockRejectedValue(new Error("provider down"));
    const member = freshMember();

    const res = await postClothes(member.token);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.source).toBe("fallback");

    const usage = await TryOnUsage.findOne({ email: member.email }).lean();
    expect(usage?.count).toBe(0);
  });

  it("consumes exactly one slot when the provider returns a real result", async () => {
    vi.spyOn(YouCamService, "tryOnClothes").mockResolvedValue({
      data: { result: { url: "https://cdn.example.com/result.jpg" } },
    } as any);
    const member = freshMember();

    const res = await postClothes(member.token);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.source).toBe("youcam");

    const usage = await TryOnUsage.findOne({ email: member.email }).lean();
    expect(usage?.count).toBe(1);
  });

  it("a fallback never drops an already-earned refund below zero", async () => {
    vi.spyOn(YouCamService, "tryOnClothes").mockRejectedValue(new Error("provider down"));
    const member = freshMember();
    // No reservation exists yet for this brand-new member — the very first
    // call already exercises the "nothing to refund below zero" path.
    await postClothes(member.token);
    await postClothes(member.token);

    const usage = await TryOnUsage.findOne({ email: member.email }).lean();
    expect(usage?.count).toBe(0);
  });
});
