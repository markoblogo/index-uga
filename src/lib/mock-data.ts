import type { Locale } from "@/lib/i18n";

export type CommodityId =
  | "corn"
  | "wheat-115"
  | "feed-wheat"
  | "gmo-soybean";

export type Commodity = {
  id: CommodityId;
  code: string;
  marker: string;
  name: Record<Locale, string>;
  latest: number;
  absoluteChange: number;
  percentChange: number;
  sparkline: number[];
};

export type Respondent = {
  id: string;
  legalName: string;
};

export type LatestQuote = {
  id: string;
  commodityId: CommodityId;
  date: string;
  basis: string;
  price: number;
  absoluteChange: number;
  percentChange: number;
  respondents: number;
};

export type Partner = {
  id: string;
  name: string;
  role: Record<Locale, string>;
};

export const indexUpdatedAt = "2026-05-08T10:30:00.000Z";

export const commodities: Commodity[] = [
  {
    id: "corn",
    code: "CORN",
    marker: "C",
    name: {
      uk: "Кукурудза",
      en: "Corn",
    },
    latest: 214,
    absoluteChange: 2,
    percentChange: 0.8,
    sparkline: [209, 211, 210, 213, 214],
  },
  {
    id: "wheat-115",
    code: "WHT 11.5",
    marker: "W",
    name: {
      uk: "Пшениця 11.5pro",
      en: "Wheat 11.5% protein",
    },
    latest: 231,
    absoluteChange: 3,
    percentChange: 1.2,
    sparkline: [226, 228, 229, 230, 231],
  },
  {
    id: "feed-wheat",
    code: "FEED WHT",
    marker: "F",
    name: {
      uk: "Пшениця фураж",
      en: "Feed wheat",
    },
    latest: 206,
    absoluteChange: -1,
    percentChange: -0.4,
    sparkline: [209, 208, 207, 207, 206],
  },
  {
    id: "gmo-soybean",
    code: "GMO SOY",
    marker: "S",
    name: {
      uk: "Соя ГМО",
      en: "GMO soybean",
    },
    latest: 418,
    absoluteChange: 2,
    percentChange: 0.5,
    sparkline: [414, 415, 417, 416, 418],
  },
];

export const respondents: Respondent[] = [
  { id: "bunge-ukraine", legalName: "ПІІ «БУНГЕ ЮКРЕЙН»" },
  { id: "adm-ukraine", legalName: "ТОВ «АДМ ЮКРЕЙН»" },
  { id: "hermes-trading", legalName: "ТОВ «Гермес-Трейдінг»" },
  { id: "louis-dreyfus-ukraine", legalName: "ТОВ «Луї Дрейфус Україна»" },
  { id: "kernel-trade", legalName: "ТОВ «Кернел-Трейд»" },
  {
    id: "cofco-agri-resources-ukraine",
    legalName: "ТОВ «КОФКО АГРІ РЕСУРСІЗ УКРАЇНА»",
  },
  {
    id: "new-world-grain-ukraine",
    legalName: "ТОВ «Нью Ворлд Грейн Юкрейн»",
  },
  { id: "nibulon", legalName: "ТОВ СП «НІБУЛОН»" },
];

export const weeklySeries: Record<CommodityId, number[]> = {
  corn: [205, 207, 208, 209, 211, 210, 213, 214],
  "wheat-115": [222, 224, 226, 228, 229, 230, 230, 231],
  "feed-wheat": [211, 210, 209, 208, 207, 207, 206, 206],
  "gmo-soybean": [410, 412, 414, 415, 417, 416, 417, 418],
};

export const latestQuotes: LatestQuote[] = commodities.map((commodity) => ({
  id: `${commodity.id}-2026-05-08`,
  commodityId: commodity.id,
  date: "2026-05-08",
  basis: "FOB Black Sea",
  price: commodity.latest,
  absoluteChange: commodity.absoluteChange,
  percentChange: commodity.percentChange,
  respondents: commodity.id === "feed-wheat" ? 6 : 8,
}));

export const partners: Partner[] = [
  {
    id: "uga",
    name: "UGA",
    role: {
      uk: "Власник бренду та публічний видавець індексу",
      en: "Brand owner and public publisher",
    },
  },
  {
    id: "spike-brokers",
    name: "Spike Brokers",
    role: {
      uk: "Постачальник ринкових індикативів",
      en: "Market indicatives provider",
    },
  },
  {
    id: "cropto-mn7r",
    name: "Cropto/MN7R",
    role: {
      uk: "Технологічний партнер платформи",
      en: "Technology partner for the platform",
    },
  },
];
