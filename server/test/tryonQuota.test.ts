import { afterAll, beforeAll, describe, expect, it } from "vitest";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { env } from "../src/config/env";
import TryOnUsage from "../src/models/tryon.usage.model";
import { reserveTryOnSlot, getTryOnUsage, applyPaymentToUsage } from "../src/services/tryon.quota.service";

// A fake Express Request carrying just what resolveUserEmail() reads.
const reqFor = (email: string) => ({ user: { id: "unused", email } }) as any;

beforeAll(async () => {
  await mongoose.connect(env.MONGODB_URI);
});

afterAll(async () => {
  await TryOnUsage.deleteMany({ email: /@quota\.test\.local$/ });
  await mongoose.disconnect();
});

const freshEmail = (label: string) => `${label}-${randomUUID()}@quota.test.local`;

describe("try-on quota engine", () => {
  it("gives a brand-new account the Starter limit", async () => {
    const email = freshEmail("new-account");
    const usage = await getTryOnUsage(reqFor(email));
    expect(usage).toEqual({ used: 0, limit: env.TRY_ON_LIMIT_STARTER, plan: "starter", unlimited: false });
  });

  it("reserves slots up to the limit, then refuses", async () => {
    const email = freshEmail("exhaust");
    // Only test a couple of reservations against the real Starter limit so
    // this stays fast regardless of what TRY_ON_LIMIT_STARTER is configured to.
    await TryOnUsage.create({ email, count: env.TRY_ON_LIMIT_STARTER - 1, plan: "starter", limit: env.TRY_ON_LIMIT_STARTER, unlimited: false });

    const last = await reserveTryOnSlot(reqFor(email));
    expect(last).toBe(0);

    const overLimit = await reserveTryOnSlot(reqFor(email));
    expect(overLimit).toBeNull();
  });

  it("treats a pre-migration document (no limit/plan/unlimited fields) as Starter, not exhausted", async () => {
    const email = freshEmail("legacy");
    // Bypass the schema so the raw document really has no limit/plan/unlimited,
    // the way every TryOnUsage row did before this feature shipped.
    await TryOnUsage.collection.insertOne({ email, count: 2 } as any);

    const usage = await getTryOnUsage(reqFor(email));
    expect(usage).toEqual({ used: 2, limit: env.TRY_ON_LIMIT_STARTER, plan: "starter", unlimited: false });

    const remaining = await reserveTryOnSlot(reqFor(email));
    expect(remaining).toBe(env.TRY_ON_LIMIT_STARTER - 3);
  });

  it("an approved Essentials payment grants a fresh 40-image allowance", async () => {
    const email = freshEmail("essentials");
    await TryOnUsage.create({ email, count: env.TRY_ON_LIMIT_STARTER, plan: "starter", limit: env.TRY_ON_LIMIT_STARTER, unlimited: false });

    await applyPaymentToUsage({ email, kind: "plan", planId: "essentials" } as any);

    const usage = await getTryOnUsage(reqFor(email));
    expect(usage).toEqual({ used: 0, limit: env.TRY_ON_LIMIT_ESSENTIALS, plan: "essentials", unlimited: false });
  });

  it("an approved Atelier payment makes the account unconditionally unlimited", async () => {
    const email = freshEmail("atelier");
    await applyPaymentToUsage({ email, kind: "plan", planId: "atelier" } as any);

    const usage = await getTryOnUsage(reqFor(email));
    expect(usage).toEqual({ used: 0, limit: null, plan: "atelier", unlimited: true });

    // Unlimited bypasses the guard entirely regardless of how many reservations run.
    for (let i = 0; i < 3; i++) {
      const remaining = await reserveTryOnSlot(reqFor(email));
      expect(remaining).toBe(Number.POSITIVE_INFINITY);
    }
  });

  it("a top-up raises the limit on top of whatever plan is already active", async () => {
    const email = freshEmail("topup");
    await TryOnUsage.create({ email, count: env.TRY_ON_LIMIT_STARTER, plan: "starter", limit: env.TRY_ON_LIMIT_STARTER, unlimited: false });
    // Already exhausted before the top-up.
    expect(await reserveTryOnSlot(reqFor(email))).toBeNull();

    await applyPaymentToUsage({ email, kind: "topup", topupQty: 1 } as any);

    const usage = await getTryOnUsage(reqFor(email));
    expect(usage.limit).toBe(env.TRY_ON_LIMIT_STARTER + 1);
    expect(await reserveTryOnSlot(reqFor(email))).toBe(0);
  });

  it("a top-up on a pre-migration document adds to the implied Starter limit, not from zero", async () => {
    const email = freshEmail("legacy-topup");
    await TryOnUsage.collection.insertOne({ email, count: 3 } as any);

    await applyPaymentToUsage({ email, kind: "topup", topupQty: 2 } as any);

    const usage = await getTryOnUsage(reqFor(email));
    expect(usage.limit).toBe(env.TRY_ON_LIMIT_STARTER + 2);
  });
});
