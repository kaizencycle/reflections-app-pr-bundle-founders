export type FeatureKey = "JADE" | "HERMES" | "EVE" | "ZEUS" | "BETA_REFLECTIONS";

type FlagRule = {
  enabled?: boolean;
  allowRoles?: string[];
  denyRoles?: string[];
};

const ENV = process.env.NEXT_PUBLIC_APP_TIER ?? "public"; // founders | public

const BASE: Record<FeatureKey, FlagRule> = {
  JADE:  { enabled: ENV === "founders", allowRoles: ["founder"] },
  HERMES:{ enabled: ENV === "founders", allowRoles: ["founder"] },
  EVE:   { enabled: ENV === "founders", allowRoles: ["founder"] },
  ZEUS:  { enabled: ENV === "founders", allowRoles: ["founder","admin"] },
  BETA_REFLECTIONS: { enabled: true, allowRoles: ["founder","beta","admin"] },
};

export function isFeatureOn(key: FeatureKey, roles: string[] = []): boolean {
  const r = BASE[key]; if (!r?.enabled) return false;
  if (r.denyRoles?.some(dr => roles.includes(dr))) return false;
  if (!r.allowRoles || r.allowRoles.length === 0) return true;
  return r.allowRoles.some(ar => roles.includes(ar));
}
