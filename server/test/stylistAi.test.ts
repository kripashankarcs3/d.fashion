import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { env } from "../src/config/env";
import {
  generateStylistReplyAI,
  summariseStylistContext,
  type ChatTurn,
  type StylistContext,
} from "../src/services/stylist.service";

// The stored analysis the client posts carries the member's photo URL; the
// provider must never receive it.
const ctx = {
  analysisResult: {
    colourSeason: "Warm Autumn",
    colorProfile: { undertone: "warm", skinToneHex: "#C99B6A" },
    enhancedImageUrl: "/uploads/secret-selfie.jpg",
  },
} as StylistContext;

const completion = (content: unknown) =>
  new Response(JSON.stringify({ choices: [{ message: { content } }] }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });

describe("generateStylistReplyAI", () => {
  const originalKey = env.OPENCODE_API_KEY;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    env.OPENCODE_API_KEY = "zen-test-key";
  });

  afterEach(() => {
    env.OPENCODE_API_KEY = originalKey;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("answers from the rules engine without calling the provider when no key is set", async () => {
    env.OPENCODE_API_KEY = "";
    const r = await generateStylistReplyAI("What colours suit me best?", ctx);
    expect(r.source).toBe("rules");
    expect(r.reply).toContain("Warm Autumn");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts an OpenAI-style chat completion to OpenCode Zen", async () => {
    fetchMock.mockResolvedValue(completion("Wear **rust** and **olive**."));
    const history: ChatTurn[] = [
      { role: "user", content: "Hi" },
      { role: "assistant", content: "Hello!" },
    ];

    const r = await generateStylistReplyAI("Wedding outfit?", ctx, history);

    expect(r).toEqual({ reply: "Wear **rust** and **olive**.", source: "opencode" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${env.OPENCODE_BASE_URL}/chat/completions`);
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("Bearer zen-test-key");
    const body = JSON.parse(init.body);
    expect(body.model).toBe(env.OPENCODE_MODEL);
    expect(body.messages[0].role).toBe("system");
    expect(body.messages[0].content).toContain("Warm Autumn");
    expect(body.messages.slice(1)).toEqual([
      ...history,
      { role: "user", content: "Wedding outfit?" },
    ]);
  });

  it("never sends the member's photo URL to the provider", async () => {
    fetchMock.mockResolvedValue(completion("ok"));
    await generateStylistReplyAI("hi", ctx);
    expect(fetchMock.mock.calls[0][1].body).not.toContain("secret-selfie");
  });

  it("replays only the 12 most recent turns", async () => {
    fetchMock.mockResolvedValue(completion("ok"));
    const history: ChatTurn[] = Array.from({ length: 20 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `turn ${i}`,
    }));

    await generateStylistReplyAI("latest", ctx, history);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.messages).toHaveLength(1 + 12 + 1);
    expect(body.messages[1].content).toBe("turn 8");
  });

  it("falls back to the rules engine when the provider returns an error", async () => {
    fetchMock.mockResolvedValue(new Response("invalid api key", { status: 401 }));
    const r = await generateStylistReplyAI("What colours suit me best?", ctx);
    expect(r.source).toBe("rules");
    expect(r.reply).toContain("Warm Autumn");
  });

  it("falls back when the request fails outright", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    expect((await generateStylistReplyAI("hi", ctx)).source).toBe("rules");
  });

  it("falls back when the completion carries no text", async () => {
    fetchMock.mockResolvedValue(completion(null));
    expect((await generateStylistReplyAI("hi", ctx)).source).toBe("rules");
  });
});

describe("summariseStylistContext", () => {
  it("names palette hexes and drops entries that are not strings", () => {
    const summary = summariseStylistContext({
      analysisResult: {
        colourSeason: "Warm Autumn",
        recommendations: { outfitPalette: ["#B7410E", 42 as unknown as string] },
      },
    });
    expect(summary.bestColours).toEqual(["rust (#B7410E)"]);
  });

  it("reports when the member has no analysis yet", () => {
    expect(summariseStylistContext({}).hasAnalysis).toBe(false);
  });
});
