import { describe, expect, it } from "vitest";
import authService from "../src/services/auth.service";

describe("AuthService", () => {
  it("hashes a password and verifies it", async () => {
    const hash = await authService.hashPassword("password123");
    expect(hash).not.toBe("password123");
    expect(hash).toMatch(/^\$2[aby]\$/);

    expect(await authService.comparePassword("password123", hash)).toBe(true);
  });

  it("rejects a wrong password", async () => {
    const hash = await authService.hashPassword("password123");
    expect(await authService.comparePassword("wrong-password", hash)).toBe(false);
  });

  it("produces different salts for the same password", async () => {
    const a = await authService.hashPassword("same");
    const b = await authService.hashPassword("same");
    expect(a).not.toBe(b);
  });
});
