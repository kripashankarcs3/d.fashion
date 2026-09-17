import { afterEach, describe, expect, it, vi } from "vitest";

// Mirrors the email.service.test.ts pattern: cloudinary.service.ts caches
// whether it's configured at module scope, so each test needs a fresh
// module + a fresh env mock to exercise a different configuration state.
const ENV_BASE = {
  CLOUDINARY_CLOUD_NAME: "",
  CLOUDINARY_API_KEY: "",
  CLOUDINARY_API_SECRET: "",
};

const load = async (envOverrides: Partial<typeof ENV_BASE>, uploadStreamImpl?: (opts: any, cb: any) => { end: (b: Buffer) => void }) => {
  vi.resetModules();
  const config = vi.fn();
  const destroy = vi.fn().mockResolvedValue({ result: "ok" });
  const upload_stream = vi.fn(uploadStreamImpl ?? ((_opts, cb) => ({
    end: () => cb(null, { secure_url: "https://res.cloudinary.com/demo/image/upload/v1/deestyle-gallery/f1.jpg" }),
  })));
  vi.doMock("cloudinary", () => ({ v2: { config, uploader: { upload_stream, destroy } } }));
  vi.doMock("../src/config/env", () => ({ env: { ...ENV_BASE, ...envOverrides } }));
  const mod = await import("../src/services/cloudinary.service");
  return { ...mod, config, destroy, upload_stream };
};

describe("cloudinary.service", () => {
  afterEach(() => {
    vi.doUnmock("cloudinary");
    vi.doUnmock("../src/config/env");
  });

  it("reports unconfigured when any credential is missing", async () => {
    const { isCloudinaryConfigured, config } = await load({ CLOUDINARY_CLOUD_NAME: "demo" });
    expect(isCloudinaryConfigured()).toBe(false);
    expect(config).not.toHaveBeenCalled();
  });

  it("configures the SDK once credentials are all present", async () => {
    const { isCloudinaryConfigured, config } = await load({
      CLOUDINARY_CLOUD_NAME: "demo",
      CLOUDINARY_API_KEY: "key",
      CLOUDINARY_API_SECRET: "secret",
    });
    expect(isCloudinaryConfigured()).toBe(true);
    expect(config).toHaveBeenCalledWith(expect.objectContaining({ cloud_name: "demo", api_key: "key", api_secret: "secret" }));
  });

  it("uploadToCloudinary resolves with the secure_url", async () => {
    const { uploadToCloudinary } = await load({
      CLOUDINARY_CLOUD_NAME: "demo",
      CLOUDINARY_API_KEY: "key",
      CLOUDINARY_API_SECRET: "secret",
    });
    const url = await uploadToCloudinary(Buffer.from("fake-image"), "tryon-abc");
    expect(url).toBe("https://res.cloudinary.com/demo/image/upload/v1/deestyle-gallery/f1.jpg");
  });

  it("uploadToCloudinary rejects when the SDK reports an error", async () => {
    const { uploadToCloudinary } = await load(
      { CLOUDINARY_CLOUD_NAME: "demo", CLOUDINARY_API_KEY: "key", CLOUDINARY_API_SECRET: "secret" },
      (_opts, cb) => ({ end: () => cb(new Error("network down"), null) }),
    );
    await expect(uploadToCloudinary(Buffer.from("x"), "f")).rejects.toThrow("network down");
  });

  it("isCloudinaryUrl only matches URLs this module hands out", async () => {
    const { isCloudinaryUrl } = await load({});
    expect(isCloudinaryUrl("https://res.cloudinary.com/demo/image/upload/v1/deestyle-gallery/f1.jpg")).toBe(true);
    expect(isCloudinaryUrl("/gallery/f1.jpg")).toBe(false);
    expect(isCloudinaryUrl("https://provider.example.com/f1.jpg")).toBe(false);
  });

  it("deleteFromCloudinary extracts the public_id and destroys it", async () => {
    const { deleteFromCloudinary, destroy } = await load({
      CLOUDINARY_CLOUD_NAME: "demo",
      CLOUDINARY_API_KEY: "key",
      CLOUDINARY_API_SECRET: "secret",
    });
    await deleteFromCloudinary("https://res.cloudinary.com/demo/image/upload/v1700000000/deestyle-gallery/tryon-abc.jpg");
    expect(destroy).toHaveBeenCalledWith("deestyle-gallery/tryon-abc", { resource_type: "image" });
  });

  it("deleteFromCloudinary never throws when the SDK call fails", async () => {
    vi.resetModules();
    const destroy = vi.fn().mockRejectedValue(new Error("boom"));
    vi.doMock("cloudinary", () => ({ v2: { config: vi.fn(), uploader: { upload_stream: vi.fn(), destroy } } }));
    vi.doMock("../src/config/env", () => ({ env: ENV_BASE }));
    const { deleteFromCloudinary } = await import("../src/services/cloudinary.service");
    await expect(
      deleteFromCloudinary("https://res.cloudinary.com/demo/image/upload/v1/deestyle-gallery/f1.jpg"),
    ).resolves.toBeUndefined();
  });
});
