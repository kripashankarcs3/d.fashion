import { describe, expect, it, beforeAll, afterAll, vi } from "vitest";
import type { AddressInfo } from "net";
import http from "http";
import jwt from "jsonwebtoken";
import app from "../src/app";
import { isWeakJwtSecret, assertJwtSecretForProduction } from "../src/config/env";

const TEST_SECRET = "test-secret";

const token = (id: string) => jwt.sign({ id, email: `${id}@test.local` }, TEST_SECRET);

let server: http.Server;
let baseUrl = "";

beforeAll(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
      resolve();
    });
  });
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

describe("B.4 backend acceptance tests", () => {
  it("1. POST /api/analyze/upload without a token -> 401", async () => {
    const res = await fetch(`${baseUrl}/api/analyze/upload`, { method: "POST" });
    expect(res.status).toBe(401);
  });

  it("2. POST /api/tryon/clothes without a token -> 401", async () => {
    const res = await fetch(`${baseUrl}/api/tryon/clothes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    });
    expect(res.status).toBe(401);
  });

  it("3. uploads a 12MB file -> 413 with a readable message", async () => {
    const fd = new FormData();
    fd.append(
      "image",
      new Blob([new Uint8Array(12 * 1024 * 1024)], { type: "image/jpeg" }),
      "big.jpg"
    );
    const res = await fetch(`${baseUrl}/api/analyze/upload`, {
      method: "POST",
      headers: { authorization: `Bearer ${token("upload-user")}` },
      body: fd,
    });
    expect(res.status).toBe(413);
    const json = (await res.json()) as { message?: string };
    expect(json.message?.toLowerCase()).toMatch(/larger than 10 mb|too large/);
  });

  it("4. uploads a .txt file -> 400", async () => {
    const fd = new FormData();
    fd.append("image", new Blob(["hello"], { type: "text/plain" }), "evil.txt");
    const res = await fetch(`${baseUrl}/api/analyze/upload`, {
      method: "POST",
      headers: { authorization: `Bearer ${token("upload-user")}` },
      body: fd,
    });
    expect(res.status).toBe(400);
  });

  it("5. DELETE /api/favorites/not-an-id -> 404", async () => {
    const res = await fetch(`${baseUrl}/api/favorites/not-an-id`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${token("fav-user")}` },
    });
    expect(res.status).toBe(404);
  });

  it("6. POST /api/chat with a 5,000-char message -> 400", async () => {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token("chat-user")}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ message: "a".repeat(5000) }),
    });
    expect(res.status).toBe(400);
  });

  it("7. 9th analysis in one hour by the same user -> 429", async () => {
    const headers = { authorization: `Bearer ${token("limiter-user")}` };
    const statuses: number[] = [];
    for (let i = 0; i < 9; i++) {
      const res = await fetch(`${baseUrl}/api/analyze/upload`, { method: "POST", headers });
      statuses.push(res.status);
    }
    expect(statuses.slice(0, 8).every((s) => s !== 429)).toBe(true);
    expect(statuses[8]).toBe(429);
  });

  it("8. production boot with a weak JWT_SECRET calls process.exit(1)", () => {
    expect(isWeakJwtSecret("deestyle-jwt-secret-key-2024")).toBe(true);
    expect(isWeakJwtSecret("5d9f4c8a2b7e".repeat(6))).toBe(false);

    const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as any);
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      assertJwtSecretForProduction("production");
      expect(exitSpy).toHaveBeenCalledWith(1);
    } finally {
      exitSpy.mockRestore();
      errSpy.mockRestore();
    }
  });

  it("9. GET /api/health/live -> 200 while /api/health/ready -> 503 (DB down)", async () => {
    const live = await fetch(`${baseUrl}/api/health/live`);
    expect(live.status).toBe(200);

    const ready = await fetch(`${baseUrl}/api/health/ready`);
    expect(ready.status).toBe(503);
  });
});
