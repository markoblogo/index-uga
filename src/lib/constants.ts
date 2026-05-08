export const SITE_CONFIG = {
  name: "UGA Index",
  publicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  defaultDeliveryBasis: "FOB Black Sea",
  currency: "USD",
  unit: "t",
} as const;
