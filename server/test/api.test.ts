/**
 * B.4 Backend Acceptance Tests
 *
 * Covers the 9 scenarios from the production-upgrade spec.
 * Uses the same http.Server + native fetch pattern as security.integration.test.ts
 * (supertest is not in devDependencies).
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import http from "http";
import type { AddressInfo } from "net";
import jwt from "jsonwebtoken";
import app from "../src/app";
import { isWeakJwtSecret } from "../src/config/env";

// ── helpers ────────────────────────────────────────────────────────────────

const TEST_SECRET = "test-secret"; // matches vitest.config.ts env.JWT_SECRET

/** Create a signed JWT that authenticate() will accept (local JWT path). */
const token = (id: string) =>
  jwt.sign({ id, email: `${id}@test.local` }, TEST_SECRET);

let server: http.Server;
let base = "";

beforeAll(
  () =>
    new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
        resolve();
      });
    })
);

afterAll(
  () =>
    new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    )
);

// ── tests ──────────────────────────────────────────────────────────────────

describe("B.4 backend acceptance tests", () => {
  // 1. POST /api/analyze/upload without Authorization header → 401
  it("1. POST /api/analyze/upload without a token → 401", async () => {
    const res = await fetch(`${base}/api/analyze/upload`, { method: "POST" });
    expect(res.status).toBe(401);
  });

  // 2. POST /api/tryon/clothes without Authorization header → 401
  it("2. POST /api/tryon/clothes without a token → 401", async () => {
    const res = await fetch(`${base}/api/tryon/clothes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(401);
  });

  // 3. Upload a file > 10 MB → 413 with a readable message (not "Internal Server Error")
  it("3. uploading an 11 MB file → 413 with a readable message", async () => {
    const bigBuffer = Buffer.alloc(11 * 1024 * 1024, 0x42); // 11 MB

    const fd = new FormData();
    fd.append(
      "image",
      new Blob([bigBuffer], { type: "image/jpeg" }),
      "big.jpg"
    );

    const res = await fetch(`${base}/api/analyze/upload`, {
      method: "POST",
      headers: { authorization: `Bearer ${token("big-upload-user")}` },
      body: fd,
    });

    expect(res.status).toBe(413);

    const json = (await res.json()) as { message?: string };
    expect(json.message).toBeDefined();
    expect(json.message!.toLowerCase()).not.toContain("internal server error");
    // The error handler returns: "Image is larger than 10 MB. Please upload a smaller photo."
    expect(json.message!.toLowerCase()).toMatch(/larger than 10 mb|too large/);
  });

  // 4. Upload a .txt file → 400
  it("4. uploading a .txt file → 400", async () => {
    const fd = new FormData();
    fd.append(
      "image",
      new Blob(["hello world"], { type: "text/plain" }),
      "evil.txt"
    );

    const res = await fetch(`${base}/api/analyze/upload`, {
      method: "POST",
      headers: { authorization: `Bearer ${token("txt-upload-user")}` },
      body: fd,
    });

    expect(res.status).toBe(400);
  });

  // 5. DELETE /api/favorites/not-an-id with a valid token → 404
  // (the favorite controller explicitly validates ObjectId and returns 404 for invalid ids)
  it("5. DELETE /api/favorites/not-an-id with a valid token → 404", async () => {
    const res = await fetch(`${base}/api/favorites/not-an-id`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${token("fav-user")}` },
    });
    expect(res.status).toBe(404);
  });

  // 6. POST /api/chat with a message longer than 1000 chars → 400
  it("6. POST /api/chat with a 1001-char message → 400", async () => {
    const res = await fetch(`${base}/api/chat`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token("chat-user")}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ message: "a".repeat(1001) }),
    });
    expect(res.status).toBe(400);
  });

  // 7. Unit test for isWeakJwtSecret
  it("7. isWeakJwtSecret: true for 'deestyle-jwt-secret', false for a 48-char random string", () => {
    // Contains the word "deestyle" — should be considered weak
    expect(isWeakJwtSecret("deestyle-jwt-secret")).toBe(true);

    // 48 random hex chars, no dictionary words — strong secret
    const strong = "a3f8c1e2d4b56790fa3f8c1e2d4b56790fa3f8c1e2d4b567";
    expect(strong.length).toBe(48);
    expect(isWeakJwtSecret(strong)).toBe(false);
  });

  // 8. GET /api/health/live → 200 with { status: 'ok' }
  it("8. GET /api/health/live → 200 { status: 'ok' }", async () => {
    const res = await fetch(`${base}/api/health/live`);
    expect(res.status).toBe(200);

    const json = (await res.json()) as { status?: string };
    expect(json.status).toBe("ok");
  });

  // 9. GET /api/health/ready → 200 or 503 (never crashes)
  it("9. GET /api/health/ready → 200 or 503 (not a crash)", async () => {
    const res = await fetch(`${base}/api/health/ready`);
    expect([200, 503]).toContain(res.status);

    // Response must always be valid JSON with a status field
    const json = (await res.json()) as { status?: string };
    expect(json.status).toBeDefined();
  });
});
