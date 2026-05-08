# Known Limitations and Production Next Steps

This document separates demo behavior from production requirements for UGA Index.

## Demo Limitations

- Authentication is intentionally mocked. Any username and password can log in as admin, respondent, or member.
- Demo sessions use a simple cookie and are not suitable for production security.
- Without `DATABASE_URL`, admin edits, respondent submissions, published indices, and audit-like events are stored in process memory and reset when the dev server restarts.
- The Prisma data model is PostgreSQL-ready, but local QA in this pass used mock/in-memory data because no database URL was configured.
- Spike Brokers values are seeded or mocked indicatives. There is no live Spike ingestion, reconciliation, or delivery confirmation.
- The public analytics page shows demo data and demo access blocks for all visitor types. Real entitlement checks are not implemented.
- Member and paid-access areas are represented as future access levels, not production-grade gated products.
- The signed methodology PDF block is a placeholder until the official document is provided.
- Geolocation locale detection depends on country headers from the hosting layer. On localhost, root routing falls back to cookie or English.
- Empty and insufficient basket states are covered by the calculation unit tests and UI status components, but the default mock UI fixture is intentionally publishable for the live demo flow.
- The embeddable widget uses demo CSP and frame ancestor configuration. Production origins must be reviewed before launch.
- Published values are locked for the demo flow, but production correction workflows need explicit governance and approval rules.

## Production Next Steps

1. Replace demo authentication with production identity, passwordless or SSO login, secure sessions, and role assignment.
2. Provision PostgreSQL, apply Prisma migrations, seed reference data, and make the database the primary source for submissions, calculations, publications, and audit logs.
3. Build a real Spike Brokers integration for indicative ingestion, validation, retries, and operational monitoring.
4. Add durable audit views with actor identity, before/after JSON, timestamps, and export capability.
5. Define respondent onboarding, company-user mapping, submission deadlines, reminder logic, and late correction policy.
6. Add publication approval rules, correction/versioning workflow, and operational alerts for insufficient baskets.
7. Implement UGA member and paid-access entitlements, including subscription or invoice-based access if required.
8. Finalize the official signed methodology PDF and publish it from a durable document store.
9. Configure production `NEXT_PUBLIC_SITE_URL`, `ALLOWED_EMBED_ORIGINS`, `DATABASE_URL`, and `DEMO_AUTH_SECRET` in Vercel.
10. Run cross-browser and device QA against the Vercel deployment domain before migration to the final public domain.

## Demo Readiness Notes

- The recommended live demo path uses mock data so it works without a database.
- For a database-backed demo, configure `DATABASE_URL`, run `npx prisma db push`, then run `npm run db:seed`.
- The development domain can be changed without code changes by updating `NEXT_PUBLIC_SITE_URL`.
- Embed allowlists can be changed without code changes by updating `ALLOWED_EMBED_ORIGINS`.
