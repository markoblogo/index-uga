import { db } from "@/lib/db";
import { hasDatabaseUrl } from "@/lib/admin-daily-inputs";
import { SITE_CONFIG } from "@/lib/constants";
import {
  commodities,
  latestQuotes,
  weeklySeries,
  type CommodityId,
} from "@/lib/mock-data";
import { getPublicIndexSnapshot } from "@/lib/public-index-data";

export type PublicLatestItem = {
  commodityId: CommodityId;
  commodityCode: string;
  commodityNameUk: string;
  commodityNameEn: string;
  date: string;
  basis: string;
  valueUsdPerMt: number;
  changeAbs: number;
  changePct: number;
  respondents: number;
};

export type PublicHistoryItem = PublicLatestItem & {
  status: "published";
};

const BASIS_CODE = "FOB_BLACK_SEA";
const BASKET_CODE = "FOB_BLACK_SEA_DEMO";
const demoDates = [
  "2026-05-01",
  "2026-05-02",
  "2026-05-03",
  "2026-05-04",
  "2026-05-05",
  "2026-05-06",
  "2026-05-07",
  "2026-05-08",
];

const mockCommodityIdByCode: Record<string, CommodityId> = {
  CORN: "corn",
  WHT_115: "wheat-115",
  "WHT 11.5": "wheat-115",
  FEED_WHT: "feed-wheat",
  "FEED WHT": "feed-wheat",
  GMO_SOY: "gmo-soybean",
  "GMO SOY": "gmo-soybean",
};

export async function getPublicLatestData() {
  if (!hasDatabaseUrl()) {
    return getMockLatestData();
  }

  try {
    return await getDatabaseLatestData();
  } catch (error) {
    console.warn("Falling back to mock public latest data.", error);
    return getMockLatestData();
  }
}

export async function getPublicHistoryData() {
  if (!hasDatabaseUrl()) {
    return getMockHistoryData();
  }

  try {
    return await getDatabaseHistoryData();
  } catch (error) {
    console.warn("Falling back to mock public history data.", error);
    return getMockHistoryData();
  }
}

async function getMockLatestData(): Promise<PublicLatestItem[]> {
  const snapshot = await getPublicIndexSnapshot();

  return snapshot.latestQuotes.map((quote) => {
    const commodity = commodities.find((item) => item.id === quote.commodityId)!;

    return {
      commodityId: commodity.id,
      commodityCode: commodity.code,
      commodityNameUk: commodity.name.uk,
      commodityNameEn: commodity.name.en,
      date: quote.date,
      basis: quote.basis,
      valueUsdPerMt: quote.price,
      changeAbs: quote.absoluteChange,
      changePct: quote.percentChange,
      respondents: quote.respondents,
    };
  });
}

function getMockHistoryData(): PublicHistoryItem[] {
  return commodities.flatMap((commodity) =>
    weeklySeries[commodity.id].map((value, index, values) => {
      const previousValue = values[index - 1] ?? value;
      const changeAbs = roundOne(value - previousValue);

      return {
        commodityId: commodity.id,
        commodityCode: commodity.code,
        commodityNameUk: commodity.name.uk,
        commodityNameEn: commodity.name.en,
        date: demoDates[index],
        basis: SITE_CONFIG.defaultDeliveryBasis,
        valueUsdPerMt: value,
        changeAbs,
        changePct:
          previousValue === 0 ? 0 : roundTwo((changeAbs / previousValue) * 100),
        respondents: latestQuotes.find((quote) => quote.commodityId === commodity.id)
          ?.respondents ?? 8,
        status: "published",
      };
    }),
  );
}

async function getDatabaseLatestData(): Promise<PublicLatestItem[]> {
  const [basis, basket, dbCommodities] = await Promise.all([
    db.deliveryBasis.findUnique({ where: { code: BASIS_CODE } }),
    db.basket.findUnique({ where: { code: BASKET_CODE } }),
    db.commodity.findMany({
      orderBy: { sortOrder: "asc" },
      where: { status: "published" },
    }),
  ]);

  if (!basis || !basket) {
    return getMockLatestData();
  }

  const rows = await Promise.all(
    dbCommodities.map(async (commodity) => {
      const published = await db.publishedIndex.findFirst({
        orderBy: { tradeDate: "desc" },
        where: {
          commodityId: commodity.id,
          deliveryBasisId: basis.id,
          basketId: basket.id,
          locked: true,
          status: "published",
        },
      });

      if (!published) {
        return null;
      }

      return {
        commodityId: mockCommodityIdByCode[commodity.code] ?? "corn",
        commodityCode: commodity.code,
        commodityNameUk: commodity.nameUk,
        commodityNameEn: commodity.nameEn,
        date: published.tradeDate.toISOString().slice(0, 10),
        basis: SITE_CONFIG.defaultDeliveryBasis,
        valueUsdPerMt: published.valueUsdPerMt.toNumber(),
        changeAbs: published.changeAbsUsdPerMt?.toNumber() ?? 0,
        changePct: published.changePct?.toNumber() ?? 0,
        respondents: 8,
      };
    }),
  );

  return rows.filter((row): row is PublicLatestItem => Boolean(row));
}

async function getDatabaseHistoryData(): Promise<PublicHistoryItem[]> {
  const [basis, basket] = await Promise.all([
    db.deliveryBasis.findUnique({ where: { code: BASIS_CODE } }),
    db.basket.findUnique({ where: { code: BASKET_CODE } }),
  ]);

  if (!basis || !basket) {
    return getMockHistoryData();
  }

  const rows = await db.publishedIndex.findMany({
    include: { commodity: true },
    orderBy: [{ tradeDate: "desc" }, { commodity: { sortOrder: "asc" } }],
    take: 365,
    where: {
      deliveryBasisId: basis.id,
      basketId: basket.id,
      locked: true,
      status: "published",
    },
  });

  return rows.map((row) => ({
    commodityId: mockCommodityIdByCode[row.commodity.code] ?? "corn",
    commodityCode: row.commodity.code,
    commodityNameUk: row.commodity.nameUk,
    commodityNameEn: row.commodity.nameEn,
    date: row.tradeDate.toISOString().slice(0, 10),
    basis: SITE_CONFIG.defaultDeliveryBasis,
    valueUsdPerMt: row.valueUsdPerMt.toNumber(),
    changeAbs: row.changeAbsUsdPerMt?.toNumber() ?? 0,
    changePct: row.changePct?.toNumber() ?? 0,
    respondents: 8,
    status: "published",
  }));
}

function roundOne(value: number) {
  return Math.round(value * 10) / 10;
}

function roundTwo(value: number) {
  return Math.round(value * 100) / 100;
}
