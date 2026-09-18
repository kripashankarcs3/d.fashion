import { describe, expect, it } from "vitest";
import { isAdminEmail, isAdminRequest } from "../src/middleware/requireAdmin";

const ADMIN_EMAIL = "admin@test.local"; // matches vitest.config.ts env.ADMIN_EMAILS

describe("isAdminEmail", () => {
  it("matches the allowlist regardless of case and surrounding space", () => {
    expect(isAdminEmail(ADMIN_EMAIL)).toBe(true);
    expect(isAdminEmail(`  ${ADMIN_EMAIL.toUpperCase()}  `)).toBe(true);
  });

  it("rejects anything not on the allowlist", () => {
    expect(isAdminEmail("someone@else.com")).toBe(false);
    expect(isAdminEmail("")).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
    expect(isAdminEmail(null)).toBe(false);
  });
});

describe("isAdminRequest", () => {
  it("grants a Firebase session whose email is verified", () => {
    expect(
      isAdminRequest({ email: ADMIN_EMAIL, provider: "firebase", emailVerified: true }),
    ).toBe(true);
  });

  it("refuses a Firebase session whose email is NOT verified", () => {
    // Anyone can self-register a Firebase account against an address they do
    // not own; without this the allowlist alone would hand over admin.
    expect(
      isAdminRequest({ email: ADMIN_EMAIL, provider: "firebase", emailVerified: false }),
    ).toBe(false);
    expect(isAdminRequest({ email: ADMIN_EMAIL, provider: "firebase" })).toBe(false);
  });

  it("refuses a non-allowlisted email even when verified", () => {
    expect(
      isAdminRequest({ email: "attacker@evil.com", provider: "firebase", emailVerified: true }),
    ).toBe(false);
  });

  it("leaves the legacy local-JWT path alone (no provider claim to check)", () => {
    expect(isAdminRequest({ email: ADMIN_EMAIL })).toBe(true);
  });

  it("refuses an empty or missing session", () => {
    expect(isAdminRequest(undefined)).toBe(false);
    expect(isAdminRequest(null)).toBe(false);
    expect(isAdminRequest({})).toBe(false);
  });
});
