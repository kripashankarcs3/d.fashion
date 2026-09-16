import { afterEach, describe, expect, it, vi } from "vitest";

// email.service.ts caches its transporter at module scope (built once, from
// env, on first use) — each test needs a clean module + a fresh env mock to
// exercise a different configuration state, so nodemailer and config/env are
// re-mocked and the module re-imported per test rather than at file scope.
const ENV_BASE = {
  ADMIN_EMAILS: "",
  SMTP_USER: "",
  SMTP_APP_PASSWORD: "",
  NOTIFY_EMAIL: "",
};

const load = async (envOverrides: Partial<typeof ENV_BASE>, sendMail: ReturnType<typeof vi.fn>) => {
  vi.resetModules();
  const createTransport = vi.fn(() => ({ sendMail }));
  vi.doMock("nodemailer", () => ({ default: { createTransport }, createTransport }));
  vi.doMock("../src/config/env", () => ({ env: { ...ENV_BASE, ...envOverrides } }));
  const mod = await import("../src/services/email.service");
  return { sendPaymentAlert: mod.sendPaymentAlert, createTransport };
};

const PAYMENT = { email: "member@example.com", kind: "topup" as const, topupQty: 2, amount: 10, utr: "UTR123" };

describe("sendPaymentAlert", () => {
  afterEach(() => {
    vi.doUnmock("nodemailer");
    vi.doUnmock("../src/config/env");
  });

  it("does nothing when SMTP is not configured", async () => {
    const sendMail = vi.fn();
    const { sendPaymentAlert, createTransport } = await load({}, sendMail);

    await sendPaymentAlert(PAYMENT);

    expect(createTransport).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("does nothing when there is no recipient (SMTP set but no NOTIFY_EMAIL/ADMIN_EMAILS)", async () => {
    const sendMail = vi.fn();
    const { sendPaymentAlert, createTransport } = await load(
      { SMTP_USER: "bot@gmail.com", SMTP_APP_PASSWORD: "app-pass" },
      sendMail,
    );

    await sendPaymentAlert(PAYMENT);

    expect(createTransport).toHaveBeenCalledTimes(1);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("emails NOTIFY_EMAIL when configured, with the payment details in the body", async () => {
    const sendMail = vi.fn().mockResolvedValue({});
    const { sendPaymentAlert } = await load(
      { SMTP_USER: "bot@gmail.com", SMTP_APP_PASSWORD: "app-pass", NOTIFY_EMAIL: "owner@example.com" },
      sendMail,
    );

    await sendPaymentAlert(PAYMENT);

    expect(sendMail).toHaveBeenCalledTimes(1);
    const call = sendMail.mock.calls[0][0];
    expect(call.to).toBe("owner@example.com");
    expect(call.text).toContain(PAYMENT.email);
    expect(call.text).toContain(PAYMENT.utr);
    expect(call.text).toContain("10");
  });

  it("falls back to the first ADMIN_EMAILS address when NOTIFY_EMAIL is unset", async () => {
    const sendMail = vi.fn().mockResolvedValue({});
    const { sendPaymentAlert } = await load(
      { SMTP_USER: "bot@gmail.com", SMTP_APP_PASSWORD: "app-pass", ADMIN_EMAILS: "first@example.com, second@example.com" },
      sendMail,
    );

    await sendPaymentAlert(PAYMENT);

    expect(sendMail.mock.calls[0][0].to).toBe("first@example.com");
  });

  it("never throws even when the SMTP send itself fails", async () => {
    const sendMail = vi.fn().mockRejectedValue(new Error("SMTP down"));
    const { sendPaymentAlert } = await load(
      { SMTP_USER: "bot@gmail.com", SMTP_APP_PASSWORD: "app-pass", NOTIFY_EMAIL: "owner@example.com" },
      sendMail,
    );

    await expect(sendPaymentAlert(PAYMENT)).resolves.toBeUndefined();
  });
});
