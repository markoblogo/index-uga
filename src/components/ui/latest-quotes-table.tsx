import { SITE_CONFIG } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";
import {
  commodities as defaultCommodities,
  latestQuotes as defaultLatestQuotes,
  type Commodity,
  type LatestQuote,
} from "@/lib/mock-data";

type LatestQuotesTableProps = {
  locale: Locale;
  commodities?: Commodity[];
  quotes?: LatestQuote[];
  labels: {
    commodity: string;
    basis: string;
    price: string;
    change: string;
    respondents: string;
  };
};

export function LatestQuotesTable({
  locale,
  labels,
  commodities = defaultCommodities,
  quotes = defaultLatestQuotes,
}: LatestQuotesTableProps) {
  const commodityById = new Map(
    commodities.map((commodity) => [commodity.id, commodity]),
  );

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-uga-dark text-xs uppercase tracking-[0.16em] text-white/70">
            <tr>
              <th className="px-5 py-4 font-semibold">{labels.commodity}</th>
              <th className="px-5 py-4 font-semibold">{labels.basis}</th>
              <th className="px-5 py-4 font-semibold">{labels.price}</th>
              <th className="px-5 py-4 font-semibold">{labels.change}</th>
              <th className="px-5 py-4 font-semibold">{labels.respondents}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {quotes.map((quote) => {
              const commodity = commodityById.get(quote.commodityId);
              const isPositive = quote.absoluteChange >= 0;

              if (!commodity) {
                return null;
              }

              return (
                <tr className="text-sm" key={quote.id}>
                  <td className="px-5 py-4 font-semibold text-uga-dark">
                    {commodity.name[locale]}
                  </td>
                  <td className="px-5 py-4 text-black/60">{quote.basis}</td>
                  <td className="px-5 py-4 font-semibold text-uga-dark">
                    ${quote.price} {SITE_CONFIG.currency}/{SITE_CONFIG.unit}
                  </td>
                  <td
                    className={
                      isPositive
                        ? "px-5 py-4 font-semibold text-uga-green"
                        : "px-5 py-4 font-semibold text-black"
                    }
                  >
                    {isPositive ? "+" : ""}
                    {quote.absoluteChange} USD · {isPositive ? "+" : ""}
                    {quote.percentChange}%
                  </td>
                  <td className="px-5 py-4 text-black/60">
                    {quote.respondents}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
