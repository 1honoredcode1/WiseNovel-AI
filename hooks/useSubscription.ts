"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { PLANS, PLAN_LIMITS, PlanType } from "@/lib/subscription-contants";

export const useSubscription = () => {
  const { isLoaded: isAuthLoaded, has } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();

  const isLoaded = isAuthLoaded && isUserLoaded;

  if (!isLoaded) {
    return {
      plan: PLANS.FREE,
      limits: PLAN_LIMITS[PLANS.FREE],
      isLoaded: false,
    };
  }

  let plan: PlanType = PLANS.FREE;

  // Prefer Clerk billing entitlements so client and server resolve the same plan.
  if (has?.({ plan: "pro" })) {
    plan = PLANS.PRO;
  } else if (has?.({ plan: "standard" })) {
    plan = PLANS.STANDARD;
  }

  // Check user public metadata for subscription plan
  const metadataPlan = (
    user?.publicMetadata?.plan || user?.publicMetadata?.billingPlan
  )
    ?.toString()
    .toLowerCase();

  if (plan === PLANS.FREE && metadataPlan === "pro") {
    plan = PLANS.PRO;
  } else if (plan === PLANS.FREE && metadataPlan === "standard") {
    plan = PLANS.STANDARD;
  }

  return {
    plan,
    limits: PLAN_LIMITS[plan],
    isLoaded: true,
  };
};
