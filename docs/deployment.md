# Deployment Notes

## Vercel

The app is ready to deploy on Vercel as a Next.js App Router project.

1. Connect the GitHub repository to a Vercel project.
2. Set the development domain in Vercel project domains.
3. Configure environment variables from `.env.example`.
4. Run a production build with `npm run build`.
5. Run Prisma migration and seed against the target PostgreSQL database before demo use.

## Required Environment Variables

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/uga_index?schema=public"
NEXT_PUBLIC_SITE_URL="https://index-uga.cr0pto.com"
ALLOWED_EMBED_ORIGINS="https://uga.ua https://www.uga.ua https://index-uga.cr0pto.com http://localhost:* http://127.0.0.1:*"
DEMO_AUTH_SECRET="replace-with-a-long-random-secret"
```

`NEXT_PUBLIC_SITE_URL` is the canonical public URL used by embeds, metadata, and absolute public links. Change it when migrating from the development domain to the final domain.

`ALLOWED_EMBED_ORIGINS` controls the `frame-ancestors` policy for `/embed/*`. Add the final domain or partner domains here during migration.

## Database

For a fresh PostgreSQL database:

```bash
npm install
npm run db:generate
npx prisma db push
npm run db:seed
```

For production, prefer a migration workflow once the schema is stable:

```bash
npx prisma migrate dev --name init
npx prisma migrate deploy
npm run db:seed
```

The seed creates commodities, FOB Black Sea basis, respondents, demo users, mock respondent submissions, Spike indicatives, and published demo indices.

## Public API

The public API exposes:

- `GET /api/health`
- `GET /api/public/latest`
- `GET /api/public/history`

Public index data routes use:

```http
Cache-Control: public, s-maxage=300, stale-while-revalidate=3600
```

Health uses `Cache-Control: no-store`.

## Production TODO

- Replace demo authentication with production auth and role management.
- Integrate real Spike Brokers indicative ingestion.
- Add payment and entitlement flows for paid access.
- Add member-only analytics and access control for UGA members.
- Replace demo in-memory stores with durable database-backed workflows.
