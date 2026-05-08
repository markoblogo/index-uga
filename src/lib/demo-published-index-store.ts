import "server-only";

export type DemoPublishedIndex = {
  commodityId: string;
  date: string;
  deliveryBasisId: string;
  value: number;
  changeAbs: number | null;
  changePct: number | null;
  locked: boolean;
  publishedAt: string;
  version: number;
};

const globalForPublishedIndices = globalThis as unknown as {
  ugaPublishedIndices?: Map<string, DemoPublishedIndex>;
  ugaCalculationVersions?: Map<string, number>;
};

const publishedIndices =
  globalForPublishedIndices.ugaPublishedIndices ?? new Map<string, DemoPublishedIndex>();
const calculationVersions =
  globalForPublishedIndices.ugaCalculationVersions ?? new Map<string, number>();

if (!globalForPublishedIndices.ugaPublishedIndices) {
  globalForPublishedIndices.ugaPublishedIndices = publishedIndices;
}

if (!globalForPublishedIndices.ugaCalculationVersions) {
  globalForPublishedIndices.ugaCalculationVersions = calculationVersions;
}

export function getDemoPublishedIndex({
  commodityId,
  date,
  deliveryBasisId,
}: {
  commodityId: string;
  date: string;
  deliveryBasisId: string;
}) {
  return publishedIndices.get(indexKey({ commodityId, date, deliveryBasisId })) ?? null;
}

export function setDemoPublishedIndex(index: DemoPublishedIndex) {
  publishedIndices.set(indexKey(index), index);
}

export function getLatestDemoPublishedIndexBefore({
  commodityId,
  date,
  deliveryBasisId,
}: {
  commodityId: string;
  date: string;
  deliveryBasisId: string;
}) {
  return [...publishedIndices.values()]
    .filter(
      (index) =>
        index.commodityId === commodityId &&
        index.deliveryBasisId === deliveryBasisId &&
        index.date < date,
    )
    .sort((first, second) => second.date.localeCompare(first.date))[0] ?? null;
}

export function getLatestDemoPublishedIndices(deliveryBasisId: string) {
  const latestByCommodity = new Map<string, DemoPublishedIndex>();

  for (const index of publishedIndices.values()) {
    if (index.deliveryBasisId !== deliveryBasisId) {
      continue;
    }

    const current = latestByCommodity.get(index.commodityId);
    if (!current || index.date > current.date) {
      latestByCommodity.set(index.commodityId, index);
    }
  }

  return latestByCommodity;
}

export function getDemoCalculationVersion({
  commodityId,
  date,
  deliveryBasisId,
}: {
  commodityId: string;
  date: string;
  deliveryBasisId: string;
}) {
  return calculationVersions.get(indexKey({ commodityId, date, deliveryBasisId })) ?? 1;
}

export function incrementDemoCalculationVersion({
  commodityId,
  date,
  deliveryBasisId,
}: {
  commodityId: string;
  date: string;
  deliveryBasisId: string;
}) {
  const key = indexKey({ commodityId, date, deliveryBasisId });
  const nextVersion = (calculationVersions.get(key) ?? 0) + 1;
  calculationVersions.set(key, nextVersion);
  return nextVersion;
}

function indexKey({
  commodityId,
  date,
  deliveryBasisId,
}: {
  commodityId: string;
  date: string;
  deliveryBasisId: string;
}) {
  return `${date}:${commodityId}:${deliveryBasisId}`;
}
