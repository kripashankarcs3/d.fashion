import { afterAll, beforeAll, describe, expect, it } from "vitest";
import http from "http";
import type { AddressInfo } from "net";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import app from "../src/app";
import { env } from "../src/config/env";
import TryOnUsage from "../src/models/tryon.usage.model";

const TEST_SECRET = "test-secret"; // matches vitest.config.ts env.JWT_SECRET
const token = (id: string, email: string) => jwt.sign({ id, email }, TEST_SECRET);
const ADMIN_EMAIL = "admin@test.local"; // matches vitest.config.ts env.ADMIN_EMAILS
const adminToken = token("admin-id", ADMIN_EMAIL);

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
  await TryOnUsage.deleteMany({ email: /@admin-usage\.test\.local$/ });
  await new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  await mongoose.disconnect();
});

const freshEmail = (label: string) => `${label}-${randomUUID()}@admin-usage.test.local`;

describe("GET /api/tryon/admin/usage", () => {
  it("blocks a non-admin", async () => {
    const member = freshEmail("blocked");
    const res = await fetch(`${base}/api/tryon/admin/usage`, {
      headers: { authorization: `Bearer ${token(member, member)}` },
    });
    expect(res.status).toBe(403);
  });

  it("lists accounts with their plan and remaining allowance, filterable by plan and email", async () => {
    const starter = freshEmail("starter-acct");
    const essentials = freshEmail("essentials-acct");
    await TryOnUsage.create({ email: starter, count: 3, plan: "starter", limit: env.TRY_ON_LIMIT_STARTER, unlimited: false });
    await TryOnUsage.create({ email: essentials, count: 10, plan: "essentials", limit: env.TRY_ON_LIMIT_ESSENTIALS, unlimited: false });

    const all = await fetch(`${base}/api/tryon/admin/usage?q=admin-usage.test.local&pageSize=50`, {
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(all.status).toBe(200);
    const allBody = await all.json();
    const emails = allBody.accounts.map((a: { email: string }) => a.email);
    expect(emails).toContain(starter);
    expect(emails).toContain(essentials);

    const filtered = await fetch(`${base}/api/tryon/admin/usage?plan=essentials&q=${encodeURIComponent(essentials)}`, {
      headers: { authorization: `Bearer ${adminToken}` },
    });
    const filteredBody = await filtered.json();
    expect(filteredBody.accounts).toHaveLength(1);
    expect(filteredBody.accounts[0]).toMatchObject({ email: essentials, plan: "essentials", used: 10, limit: env.TRY_ON_LIMIT_ESSENTIALS });
  });

  it("reports an unlimited (Atelier) account with a null limit", async () => {
    const atelier = freshEmail("atelier-acct");
    await TryOnUsage.create({ email: atelier, count: 7, plan: "atelier", unlimited: true });

    const res = await fetch(`${base}/api/tryon/admin/usage?q=${encodeURIComponent(atelier)}`, {
      headers: { authorization: `Bearer ${adminToken}` },
    });
    const body = await res.json();
    expect(body.accounts[0]).toMatchObject({ email: atelier, plan: "atelier", unlimited: true, limit: null });
  });
});
