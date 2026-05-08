# UGA Index Product Brief

## Overview

UGA Index is a standalone bilingual website for the Ukrainian Grain Association (UGA). It publishes a daily spot export price index for core Ukrainian grain and oilseed commodities, using market indicatives provided by Spike Brokers and technology delivered by Cropto/MN7R.

The demo combines a public market-facing website, an embeddable widget for the UGA website, and a lightweight internal workflow that shows how respondent submissions become locked, published index values.

## Goals

- Present UGA as the official brand owner of a clear, repeatable daily export price index.
- Publish daily FOB Black Sea spot index values for selected commodities.
- Support Ukrainian and English audiences with automatic and manual localization.
- Demonstrate respondent data collection, admin review, calculation, publication, and auditability.
- Provide an embeddable index widget that can be placed on the existing UGA website.

## Audiences

- Ukrainian grain market participants who need daily export price references.
- UGA members who need trusted market benchmarks and analytics.
- Media, analysts, and public stakeholders who need a concise published index.
- UGA website visitors who consume the index through an embedded widget.
- Internal demo users acting as admins, respondents, or members.

## Brand And Partner Roles

- **UGA:** brand owner, public publisher, and institutional sponsor.
- **Spike Brokers:** provider of market indicatives used for the demo index workflow.
- **Cropto/MN7R:** technology partner responsible for the demo platform, calculation workflow, localization, and embeddable widget.

## Covered Commodities

The demo index covers four commodities:

- Кукурудза / Corn
- Пшениця 11.5pro / Wheat 11.5% protein
- Пшениця фураж / Feed wheat
- Соя ГМО / GMO soybean

The default delivery basis for the demo is **FOB Black Sea**.

## Public Site

The public site should include:

- Homepage with one current index card per commodity.
- Weekly charts for each commodity.
- About page explaining the UGA Index purpose and partner roles.
- Methodology page explaining the calculation rules in plain language.
- Analytics page for weekly movement, commodity comparison, and recent history.
- Ukrainian and English localization.
- Automatic Ukrainian locale for visitors from Ukraine and English for all other visitors.
- Manual language switch that overrides automatic locale selection.
- Embeddable index widget for placement on the UGA website.

## Internal Demo

The internal demo should include:

- Mock login where any username and password works.
- Role selection or mock role assignment for `admin`, `respondent`, and `member`.
- Admin daily input matrix with respondent companies as rows and the four commodities as columns.
- Respondent daily survey form scoped to that respondent and the current date.
- Calculation preview showing raw submissions, median, excluded outliers, cleaned sample, and final average.
- Publish action that locks index values for the selected date.
- Audit log showing demo events such as login, submission update, calculation preview, publication, and attempted edits to locked data.

## Respondent Companies

- ПІІ «БУНГЕ ЮКРЕЙН»
- ТОВ «АДМ ЮКРЕЙН»
- ТОВ «Гермес-Трейдінг»
- ТОВ «Луї Дрейфус Україна»
- ТОВ «Кернел-Трейд»
- ТОВ «КОФКО АГРІ РЕСУРСІЗ УКРАЇНА»
- ТОВ «Нью Ворлд Грейн Юкрейн»
- ТОВ СП «НІБУЛОН»

## Index Methodology

For each date, commodity, and delivery basis:

1. Collect respondent prices.
2. Calculate the median price.
3. Exclude prices that deviate by more than +/-2% from the median.
4. Calculate the arithmetic average of the cleaned sample.
5. Treat the basket as publishable only when at least 5 valid respondent prices remain available.
6. Publish the calculated value and lock it against direct edits.

The demo uses a single basket with weight `1`. The product should be designed so future versions can support weighted baskets without changing the public concept.

## Success Criteria

- A visitor can understand today's index values and recent weekly movement from the homepage.
- A visitor can switch between Ukrainian and English at any time.
- Visitors from Ukraine are automatically served Ukrainian by default; all other visitors are served English by default.
- A UGA website page can embed a compact index widget.
- A respondent can submit daily commodity prices through the demo form.
- An admin can review respondent prices, preview calculations, publish values, and inspect audit events.
- Published values are visibly locked after publication.

## Assumptions

- The demo uses mock/static data until a later implementation request specifies a real backend.
- FOB Black Sea is the only required delivery basis for the first demo, but the information model should allow additional bases.
- Ukrainian and English are first-class locales.
- Corrections to published values are not direct edits; they should be represented as future audited correction actions if needed.
- The local project directory is currently empty. Git resolves to a parent repository with an unrelated remote, so repository initialization or remote correction should happen before committing or pushing this project.
