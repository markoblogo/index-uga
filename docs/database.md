# UGA Index Database Model

UGA Index uses Prisma with PostgreSQL. The schema is defined in `prisma/schema.prisma` and is designed for the public index demo plus future production-style workflows.

## Setup

Create `.env.local` or export `DATABASE_URL` before running Prisma commands:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

Then run:

```bash
npm run db:generate
npx prisma db push
npm run db:seed
```

The seed command requires an existing PostgreSQL database with the Prisma schema applied. It does not create the database itself. For this demo, `npx prisma db push` is the quickest local option; a production workflow should use migrations.

## Core Concepts

- `Commodity`: the four indexed products, stored with Ukrainian and English names.
- `DeliveryBasis`: delivery basis records. The demo seeds `FOB Black Sea`.
- `Respondent`: respondent companies that submit price observations.
- `Basket` and `BasketRespondent`: basket membership and weights. The demo uses one basket with weight `1`.
- `User`: demo admin, respondent, and member users.
- `PriceSubmission`: respondent or admin-entered USD per metric ton prices by trade date.
- `ExternalIndicative`: external source values, seeded for Spike Brokers.
- `IndexCalculation` and `IndexCalculationItem`: calculated median, included/excluded items, counts, raw value, and public rounded value.
- `PublishedIndex`: locked published index values.
- `AuditLog`: append-only demo audit trail with `beforeJson` and `afterJson` fields.

## Dates And Timestamps

Trade dates are stored separately from timestamps using PostgreSQL `date` columns through Prisma `DateTime @db.Date`. Event times such as submissions, publication, and audit creation use timestamp fields.

## Value Rules

All market prices and index values are stored as USD per metric ton:

- Raw submission values use `Decimal(12, 2)`.
- Calculation precision uses `Decimal(12, 4)` where needed.
- Public published values use `Decimal(12, 1)`.

## Sources And Statuses

Supported source values:

- `admin`
- `respondent`
- `spike`

Supported workflow statuses:

- `draft`
- `submitted`
- `verified`
- `published`

Calculations also support `insufficient_data` and `no_data` for methodologically incomplete baskets.

## Seed Data

The seed script creates:

- 4 commodities.
- 1 FOB Black Sea delivery basis.
- 8 respondent companies.
- Demo users: one admin, one member, and one user per respondent.
- 14 days of mock respondent price submissions.
- 14 days of mock Spike indicatives.
- Published indices for the previous 7 days.
- Audit log entries for the seed operation and demo publication events.

## Current Environment

`DATABASE_URL` was not available during setup in this local environment. To seed locally, provide a PostgreSQL connection string in `DATABASE_URL`, ensure the database exists, then run:

```bash
npm run db:generate
npx prisma db push
npm run db:seed
```
