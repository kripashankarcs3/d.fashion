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

describe("generateStylistReplyAI (Zen mode)", () => {
  const originalKey = env.OPENCODE_API_KEY;
  const originalMode = env.OPENCODE_MODE;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    env.OPENCODE_MODE = "zen";
    env.OPENCODE_API_KEY = "zen-test-key";
  });

  afterEach(() => {
    env.OPENCODE_API_KEY = originalKey;
    env.OPENCODE_MODE = originalMode;
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

describe("generateStylistReplyAI (OpenRouter mode, the default)", () => {
  const originalKey = env.OPENROUTER_API_KEY;
  const originalMode = env.OPENCODE_MODE;
  const originalModel = env.OPENROUTER_MODEL;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    env.OPENCODE_MODE = "openrouter";
    env.OPENROUTER_API_KEY = "openrouter-test-key";
    // A real OpenRouter id has its own "/" — this is what openCodeModelRef()'s
    // split-on-"/" would have mangled if replyViaOpenRouter reused it.
    env.OPENROUTER_MODEL = "inclusionai/ling-3.0-flash-vl:free";
  });

  afterEach(() => {
    env.OPENROUTER_API_KEY = originalKey;
    env.OPENCODE_MODE = originalMode;
    env.OPENROUTER_MODEL = originalModel;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("answers from the rules engine without calling the provider when no key is set", async () => {
    env.OPENROUTER_API_KEY = "";
    const r = await generateStylistReplyAI("What colours suit me best?", ctx);
    expect(r.source).toBe("rules");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the full multi-segment model id to OpenRouter, unsplit", async () => {
    fetchMock.mockResolvedValue(completion("Wear **rust** and **olive**."));

    const r = await generateStylistReplyAI("Wedding outfit?", ctx);

    expect(r).toEqual({ reply: "Wear **rust** and **olive**.", source: "opencode" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${env.OPENROUTER_BASE_URL}/chat/completions`);
    expect(init.headers.Authorization).toBe("Bearer openrouter-test-key");
    const body = JSON.parse(init.body);
    expect(body.model).toBe("inclusionai/ling-3.0-flash-vl:free");
  });

  it("never sends the member's photo URL to the provider", async () => {
    fetchMock.mockResolvedValue(completion("ok"));
    await generateStylistReplyAI("hi", ctx);
    expect(fetchMock.mock.calls[0][1].body).not.toContain("secret-selfie");
  });

  it("falls back to the rules engine when the provider returns an error", async () => {
    fetchMock.mockResolvedValue(new Response("invalid api key", { status: 401 }));
    const r = await generateStylistReplyAI("What colours suit me best?", ctx);
    expect(r.source).toBe("rules");
  });

  it("retries a 429 with backoff before succeeding", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response("slow down", { status: 429 }))
      .mockResolvedValueOnce(completion("ok, retried"));

    const timeoutSpy = vi.spyOn(global, "setTimeout").mockImplementation(((fn: () => void) => {
      fn();
      return 0 as unknown as NodeJS.Timeout;
    }) as typeof setTimeout);

    const r = await generateStylistReplyAI("hi", ctx);

    expect(r).toEqual({ reply: "ok, retried", source: "opencode" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    timeoutSpy.mockRestore();
  });
});

describe("generateStylistReplyAI via a local OpenCode server", () => {
  const saved = {
    mode: env.OPENCODE_MODE,
    key: env.OPENCODE_API_KEY,
    password: env.OPENCODE_SERVER_PASSWORD,
    model: env.OPENCODE_MODEL,
  };
  let fetchMock: ReturnType<typeof vi.fn>;
  let messageReply: { status: number; body: unknown };

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

  const callsTo = (method: string, pathname: string) =>
    fetchMock.mock.calls.filter(([input, init]) => {
      const url = new URL(String(input));
      return (init?.method ?? "GET") === method && url.pathname === pathname;
    });

  beforeEach(() => {
    messageReply = {
      status: 200,
      body: { info: {}, parts: [{ type: "reasoning" }, { type: "text", text: "Wear **rust**." }] },
    };
    fetchMock = vi.fn(async (input: unknown, init?: RequestInit) => {
      const url = new URL(String(input));
      const method = init?.method ?? "GET";
      if (url.pathname === "/experimental/tool/ids") return json(["bash", "read", "edit"]);
      if (method === "POST" && url.pathname === "/session") return json({ id: "ses_test" });
      if (method === "POST" && url.pathname === "/session/ses_test/message") {
        return json(messageReply.body, messageReply.status);
      }
      if (method === "DELETE") return json(true);
      return json({}, 404);
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    env.OPENCODE_MODE = "server";
    env.OPENCODE_API_KEY = "";
    env.OPENCODE_SERVER_PASSWORD = "pw";
    env.OPENCODE_MODEL = "big-pickle";
  });

  afterEach(() => {
    env.OPENCODE_MODE = saved.mode;
    env.OPENCODE_API_KEY = saved.key;
    env.OPENCODE_SERVER_PASSWORD = saved.password;
    env.OPENCODE_MODEL = saved.model;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("does not contact the server without a password", async () => {
    env.OPENCODE_SERVER_PASSWORD = "";
    const r = await generateStylistReplyAI("hi", ctx);
    expect(r.source).toBe("rules");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the message with every tool disabled, then deletes the session", async () => {
    const history: ChatTurn[] = [{ role: "user", content: "Earlier question" }];
    const r = await generateStylistReplyAI("Wedding outfit?", ctx, history);

    expect(r).toEqual({ reply: "Wear **rust**.", source: "opencode" });

    const [[input, init]] = callsTo("POST", "/session/ses_test/message");
    const url = new URL(String(input));
    expect(url.searchParams.get("directory")).toBeTruthy();
    expect(init.headers.Authorization).toBe(`Basic ${Buffer.from("opencode:pw").toString("base64")}`);

    const body = JSON.parse(init.body);
    expect(body.tools).toEqual({ bash: false, read: false, edit: false });
    expect(body.model).toEqual({ providerID: "opencode", modelID: "big-pickle" });
    expect(body.system).toContain("Warm Autumn");
    expect(body.parts[0].text).toContain("Member: Earlier question");
    expect(body.parts[0].text).toContain("Wedding outfit?");
    expect(init.body).not.toContain("secret-selfie");

    expect(callsTo("DELETE", "/session/ses_test")).toHaveLength(1);
  });

  it("sends nothing when the tool list cannot be read", async () => {
    fetchMock.mockImplementation(async () => json({}, 500));
    const r = await generateStylistReplyAI("hi", ctx);
    expect(r.source).toBe("rules");
    expect(callsTo("POST", "/session")).toHaveLength(0);
  });

  it("discards a reply that contains a tool call", async () => {
    messageReply.body = { info: {}, parts: [{ type: "tool" }, { type: "text", text: "done" }] };
    const r = await generateStylistReplyAI("hi", ctx);
    expect(r.source).toBe("rules");
    expect(callsTo("DELETE", "/session/ses_test")).toHaveLength(1);
  });

  it("falls back when the model run reports an error", async () => {
    messageReply.body = { info: { error: { name: "ProviderError" } }, parts: [] };
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
