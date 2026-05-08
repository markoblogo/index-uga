# UGA Index Implementation Plan

## Summary

Build UGA Index as a bilingual standalone demo website with a public market index experience, an embeddable widget, and an internal mock workflow for collecting respondent prices, calculating daily index values, publishing locked results, and showing an audit trail.

The first implementation should use mock/static data and client-side demo state unless a backend is explicitly added later. The design should still keep calculation, data shape, localization, and route boundaries clear enough to replace mock storage with an API.

## Delivery Phases

### Phase 1: Project Scaffold

- Initialize the application in `/Users/antonbiletskiy-volokh/Downloads/Projects/index`.
- Ensure the project is isolated from the unrelated parent Git repository before committing.
- Add routing, styling, localization, mock data, and shared domain types.
- Seed commodities, respondent companies, delivery basis, sample submissions, sample publications, users, and audit events.

### Phase 2: Public Site

- Build the homepage with current index cards for the four commodities and weekly charts.
- Build About, Methodology, and Analytics pages.
- Use UGA-first branding with partner attribution for Spike Brokers and Cropto/MN7R.
- Show FOB Black Sea as the default delivery basis.

### Phase 3: Localization And Locale Routing

- Add Ukrainian and English dictionaries for all public and internal demo labels.
- Automatically default to Ukrainian for visitors from Ukraine and English for other visitors.
- Add a manual language switch that persists the selected locale and overrides automatic detection.
- Keep route behavior predictable so every public page can render in both locales.

### Phase 4: Internal Demo

- Add mock login where any username and password succeeds.
- Support `admin`, `respondent`, and `member` roles through mock role selection or demo user profiles.
- Build the respondent daily survey form.
- Build the admin daily input matrix with respondent companies and four commodities.
- Build member read-only access to published or preview index data.

### Phase 5: Calculation And Publication

- Implement a calculation module for each date, commodity, delivery basis, and basket.
- Show calculation preview with median, excluded outliers, cleaned sample, final average, and publishability status.
- Enforce minimum respondent count of 5 for a publishable basket.
- Publish calculated values as locked records.
- Append audit events for submissions, previews, publications, and blocked locked-value edits.

### Phase 6: Widget And Demo Hardening

- Add `/widget` as an embeddable compact view for the UGA website.
- Keep the widget visually compact, localized, and independent from internal demo navigation.
- Add empty, loading, not publishable, and published states where relevant.
- Run accessibility, responsive layout, localization, and calculation checks before demo delivery.

## Architecture

- **Public route group:** homepage, About, Methodology, Analytics, and widget views.
- **Internal route group:** login, app dashboard, respondent survey, admin input matrix, publish preview, and audit log.
- **Domain module:** commodities, respondents, delivery bases, baskets, submissions, calculations, publications, roles, and audit events.
- **Calculation module:** pure functions for median, outlier exclusion, cleaned average, publishability, basket output, and locked publication state.
- **Localization module:** Ukrainian and English dictionaries, locale detection, manual override persistence, and formatting helpers.
- **Mock storage:** static seed data plus in-memory or browser-local demo state for submissions, publications, and audit events.
- **Widget delivery:** initially implement `/widget` as an iframe-friendly route; optionally add a script bundle later if the UGA integration requires non-iframe embedding.

## Data Model

Core entities:

- **Commodity:** id, Ukrainian name, English name, display order, unit, active flag.
- **DeliveryBasis:** id, label, region, active flag. Seed default: `FOB Black Sea`.
- **Respondent:** id, legal name, display name, active flag.
- **User:** id, username, role (`admin`, `respondent`, `member`), optional respondent id.
- **Submission:** id, date, respondent id, commodity id, delivery basis id, price, currency, status, updated at.
- **Basket:** id, name, delivery basis id, weight. Seed one basket with weight `1`.
- **CalculationResult:** date, commodity id, delivery basis id, basket id, raw prices, median, excluded prices, cleaned prices, average, respondent count, publishable flag.
- **Publication:** id, date, commodity id, delivery basis id, basket id, value, currency, published at, published by, locked flag.
- **AuditEvent:** id, timestamp, actor id, actor role, action, entity type, entity id, summary, metadata.

Seed respondent companies:

- ПІІ «БУНГЕ ЮКРЕЙН»
- ТОВ «АДМ ЮКРЕЙН»
- ТОВ «Гермес-Трейдінг»
- ТОВ «Луї Дрейфус Україна»
- ТОВ «Кернел-Трейд»
- ТОВ «КОФКО АГРІ РЕСУРСІЗ УКРАЇНА»
- ТОВ «Нью Ворлд Грейн Юкрейн»
- ТОВ СП «НІБУЛОН»

Seed commodities:

- Кукурудза / Corn
- Пшениця 11.5pro / Wheat 11.5% protein
- Пшениця фураж / Feed wheat
- Соя ГМО / GMO soybean

## Routes

- `/`: public homepage with index cards and weekly charts.
- `/about`: UGA Index purpose, audiences, and partner roles.
- `/methodology`: calculation method, respondent threshold, basket notes, and locked-publication policy.
- `/analytics`: weekly trends, commodity comparison, and recent history.
- `/login`: mock login accepting any username and password.
- `/app`: role-aware internal landing page.
- `/app/respondent/survey`: respondent daily survey form.
- `/app/admin/input`: admin daily input matrix.
- `/app/admin/publish`: calculation preview and publish action.
- `/app/audit`: audit log demo.
- `/widget`: embeddable public index widget.

## Calculation Rules

For each date, commodity, delivery basis, and basket:

1. Collect numeric respondent prices.
2. Calculate the median of the collected prices.
3. Exclude any price below `median * 0.98` or above `median * 1.02`.
4. Calculate the arithmetic average of the cleaned sample.
5. Mark the result publishable only if at least 5 respondent prices are valid for the basket.
6. Apply basket weight. The demo has one basket with weight `1`, so the basket value equals the cleaned average.
7. On publish, create locked publication records and audit the action.

Published values must be treated as locked. The demo should block direct edits to locked publications and record a visible audit event for any attempted locked edit.

## Acceptance Criteria

### Public Site

- Homepage displays four current index cards and weekly charts.
- About, Methodology, and Analytics pages are reachable from navigation.
- Commodity names are available in Ukrainian and English.
- Spike Brokers and Cropto/MN7R roles are clearly attributed without implying they are the UGA brand owner.
- FOB Black Sea is visible as the default delivery basis.

### Localization

- Ukrainian and English content is available for public and internal demo screens.
- Visitors from Ukraine default to Ukrainian.
- Visitors outside Ukraine default to English.
- Manual language switching overrides automatic detection and persists for the demo session.

### Internal Demo

- Any username and password can log in.
- Admin, respondent, and member role experiences are available.
- Admin can enter or edit daily respondent prices before publication.
- Respondent can submit daily prices for the four commodities.
- Member can view published or demo index values without admin controls.

### Calculation And Publication

- Median, +/-2% exclusion, cleaned average, and minimum count behavior match the documented rules.
- Baskets with fewer than 5 valid respondent prices are marked not publishable.
- Publish action creates locked publication records.
- Locked publication values cannot be directly edited.
- Calculation preview clearly identifies excluded outliers.

### Audit Log

- Audit log records demo login, submission create/update, calculation preview, publication, and blocked locked-edit attempts.
- Audit events include actor, role, timestamp, action, entity, and readable summary.

### Widget

- `/widget` renders a compact embeddable index view.
- Widget supports Ukrainian and English.
- Widget avoids internal navigation and admin controls.
- Widget can be embedded with an iframe in the UGA website.

## Assumptions

- No application code is included in this documentation-only task.
- Mock/static data is acceptable for the first demo implementation.
- A later backend can replace mock storage without changing public methodology.
- The first demo requires only FOB Black Sea, but the model supports more delivery bases.
- Weighted baskets are future-facing; the demo ships with one basket at weight `1`.
- The project directory should become its own repository or be connected to `https://github.com/markoblogo/index-uga` before any commit or push.
