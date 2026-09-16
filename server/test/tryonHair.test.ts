import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import http from "http";
import type { AddressInfo } from "net";
import jwt from "jsonwebtoken";
import app from "../src/app";
import YouCamService from "../src/services/youcam.service";
import * as quotaService from "../src/services/tryon.quota.service";

const TEST_SECRET = "test-secret"; // matches vitest.config.ts env.JWT_SECRET
const token = (id: string) => jwt.sign({ id }, TEST_SECRET);

const PERSON = "https://images.example.com/member.jpg";
const RESULT = { data: { results: { url: "https://cdn.example.com/result.jpg" } } };

let server: http.Server;
let base = "";

beforeAll(
  () =>
    new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
        resolve();
      });
    }),
);

afterAll(
  () =>
    new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve())),
    ),
);

afterEach(() => vi.restoreAllMocks());

// This suite is about hair-endpoint routing (transfer vs. style, the colour
// flag), not the quota engine (covered by tryonQuota.test.ts) — mocked out so
// it never depends on a live MongoDB connection, which the test app never
// opens (only server.ts's bootstrap calls connectDB()).
beforeEach(() => {
  vi.spyOn(quotaService, "reserveTryOnSlot").mockResolvedValue(999);
});

// Each test signs in as its own member so the per-user try-on limiter never
// carries over between cases.
const postHair = (member: string, body: Record<string, unknown>) =>
  fetch(`${base}/api/tryon/hair`, {
    method: "POST",
    headers: { authorization: `Bearer ${token(member)}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("POST /api/tryon/hair", () => {
  it("runs hair-transfer styles on the hair-transfer task with the colour flag", async () => {
    const transfer = vi.spyOn(YouCamService, "tryOnHairTransfer").mockResolvedValue(RESULT);
    const style = vi.spyOn(YouCamService, "tryOnHair");

    const res = await postHair("hair-transfer-member", {
      personImageUrl: PERSON,
      styleId: "female_two_braids",
      engine: "transfer",
      keepUsersColour: true,
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ resultUrl: RESULT.data.results.url, source: "youcam" });
    expect(transfer).toHaveBeenCalledWith({ filePath: null, url: PERSON }, "female_two_braids", true);
    expect(style).not.toHaveBeenCalled();
  });

  it("keeps the original hair-style task when no engine is given", async () => {
    const style = vi.spyOn(YouCamService, "tryOnHair").mockResolvedValue(RESULT);
    const transfer = vi.spyOn(YouCamService, "tryOnHairTransfer");

    const res = await postHair("hair-style-member", {
      personImageUrl: PERSON,
      styleId: "female_long_straight",
    });

    expect(res.status).toBe(200);
    expect(style).toHaveBeenCalledWith(PERSON, "female_long_straight");
    expect(transfer).not.toHaveBeenCalled();
  });

  it("only keeps the member's colour when keepUsersColour is exactly true", async () => {
    const transfer = vi.spyOn(YouCamService, "tryOnHairTransfer").mockResolvedValue(RESULT);

    await postHair("hair-colour-member", {
      personImageUrl: PERSON,
      styleId: "all_wolf_cut",
      engine: "transfer",
      keepUsersColour: "yes",
    });

    expect(transfer).toHaveBeenCalledWith({ filePath: null, url: PERSON }, "all_wolf_cut", false);
  });

  it("rejects a styleId that is not a string", async () => {
    const transfer = vi.spyOn(YouCamService, "tryOnHairTransfer");

    const res = await postHair("hair-invalid-member", {
      personImageUrl: PERSON,
      styleId: { $ne: null },
      engine: "transfer",
    });

    expect(res.status).toBe(400);
    expect(transfer).not.toHaveBeenCalled();
  });
});
