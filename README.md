# UGA Index

UGA Index is a demo Next.js application for the Ukrainian Grain Association. It publishes a bilingual public spot export price index for Ukrainian grain and oilseed commodities and includes internal demo workflows for respondent submissions, admin review, index calculation and publication.

The current development deployment is prepared for `index-uga.cr0pto.com`, but the app does not hardcode production domains. Public URLs, embed URLs and frame allowlists are configured through environment variables.

## Current Scope

Public site:

- Ukrainian and English locale routes: `/uk`, `/en`
- locale detection from cookie and country headers on `/`
- public homepage with current index values, FX display conversion and UGA branding
- About, Methodology and Analytics pages
- Privacy Policy, Terms of Use and Risk Disclosure pages
- embeddable cards and chart widgets for the UGA website
- public API routes for latest and historical index data

Internal demo:

- allowlist-based demo login with email/password only
- admin and respondent roles inferred from the demo allowlist
- admin daily input matrix with Spike Brokers indicative comparison
- respondent daily survey tied to one respondent company
- calculation and publish workflow with outlier handling
- demo audit and publication behavior using database-backed data when available, with mock fallback where implemented

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL-ready data model
- Vitest
- ESLint

## Local Setup

Install dependencies:

```bash
npm install
```

Copy environment variables:

```bash
cp .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Required variables are listed in `.env.example`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/uga_index?schema=public"
NEXT_PUBLIC_SITE_URL="https://index-uga.cr0pto.com"
ALLOWED_EMBED_ORIGINS="https://uga.ua https://www.uga.ua https://index-uga.cr0pto.com http://localhost:* http://127.0.0.1:*"
DEMO_AUTH_SECRET="replace-with-a-long-random-secret"
```

Notes:

- `DATABASE_URL` is required for Prisma-backed persistence and seeding.
- `NEXT_PUBLIC_SITE_URL` is used for public absolute URLs and embed snippets.
- `ALLOWED_EMBED_ORIGINS` controls the frame allowlist for `/embed/*`.
- `DEMO_AUTH_SECRET` signs the simple demo session cookie.

## Demo Login

The demo uses an allowlist in `src/lib/demo-allowlist.ts`. Users do not select their role in the login form.

Primary credentials:

- Admin: `admin@uga.ua` / `admin`
- Respondent: `bunge@uga-index.demo` / `respondent`

Presentation shortcuts:

- `admin` / `admin`
- `respondent` / `respondent`

Post-login routing:

- Admin users go to `/admin/daily-inputs`.
- Respondent users go to `/respondent`.

Production auth is documented in `docs/auth.md`.

## Routes

Public:

- `/`
- `/uk`, `/en`
- `/uk/about`, `/en/about`
- `/uk/methodology`, `/en/methodology`
- `/uk/analytics`, `/en/analytics`
- `/uk/privacy`, `/en/privacy`
- `/uk/terms`, `/en/terms`
- `/uk/risk-disclosure`, `/en/risk-disclosure`

Internal:

- `/login`
- `/logout`
- `/admin`
- `/admin/daily-inputs`
- `/admin/calculate`
- `/respondent`

Embeds:

- `/embed/cards`
- `/embed/chart`
- `/embed/uga-index.js`

Public API:

- `GET /api/health`
- `GET /api/public/latest`
- `GET /api/public/history`
- `GET /api/public/fx-rates`

## Database Setup

Generate Prisma client:

```bash
npm run db:generate
```

For a local PostgreSQL database:

```bash
npx prisma db push
npm run db:seed
```

For production-style migration flow after migrations are committed:

```bash
npx prisma migrate deploy
npm run db:seed
```

The seed creates commodities, FOB Black Sea delivery basis, respondents, demo users, 14 days of mock respondent submissions, Spike indicatives and published demo indices.

More detail is in `docs/database.md`.

## Index Calculation

The calculation engine is in `src/lib/index-calculation.ts`.

Rules:

- collect respondent prices by date, commodity and delivery basis
- calculate the median
- exclude prices deviating more than +/-2% from the median
- calculate the arithmetic average of the cleaned sample
- require at least 5 included respondent prices for `publishable`
- keep official published values in USD/t
- support future weighted baskets while demo uses a single basket

Unit tests are in `src/lib/index-calculation.test.ts`.

## Embeds

Use `NEXT_PUBLIC_SITE_URL` when preparing embed snippets.

Cards iframe example:

```html
<iframe
  src="https://index-uga.cr0pto.com/embed/cards?locale=en&theme=light&layout=cards"
  title="UGA Index"
  loading="lazy"
  style="width: 100%; height: 420px; border: 0; display: block;"
></iframe>
```

JavaScript loader example:

```html
<div id="uga-index-widget"></div>
<script
  src="https://index-uga.cr0pto.com/embed/uga-index.js"
  data-target="#uga-index-widget"
  data-locale="en"
  data-theme="light"
  data-layout="cards"
></script>
```

More detail is in `docs/embed.md`.

## Deployment

The project is prepared for Vercel deployment.

Checklist:

1. Connect the GitHub repository to Vercel.
2. Configure environment variables from `.env.example`.
3. Configure the development domain, currently `index-uga.cr0pto.com`.
4. Run Prisma setup against the target PostgreSQL database.
5. Run validation before deployment.

Validation commands:

```bash
npm run lint
npm test
npm run build
```

Health check:

```bash
curl https://YOUR_DOMAIN/api/health
```

More detail is in `docs/deployment.md`.

## Documentation

Project docs:

- `docs/product-brief.md`
- `docs/implementation-plan.md`
- `docs/database.md`
- `docs/auth.md`
- `docs/deployment.md`
- `docs/embed.md`
- `docs/demo-script.md`
- `docs/known-limitations.md`
- `docs/legal.md`
- `docs/source-analysis.md`
- `docs/variant-design-analysis.md`

Source reference materials are stored under `docs/source/`.

## Validation

Run before committing:

```bash
npm run lint
npm test
npm run build
```

## Production TODO

- Replace demo auth with production allowlist auth, password setup emails and hashed passwords.
- Integrate real Spike Brokers indicative ingestion.
- Replace any remaining mock fallback paths with durable database workflows where required.
- Finalize production legal text with legal counsel.
- Add paid analytics, UGA member access and API subscriber entitlement handling.
- Add production observability, backup and operational runbooks.
