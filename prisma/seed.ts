import { Prisma, PrismaClient } from "@prisma/client";
import { calculateIndexValue } from "../src/lib/index-calculation";

const prisma = new PrismaClient();

const BASE_DATE = new Date(Date.UTC(2026, 4, 8));

const commodities = [
  {
    code: "CORN",
    nameUk: "Кукурудза",
    nameEn: "Corn",
    sortOrder: 1,
    basePrice: 214,
  },
  {
    code: "WHT_115",
    nameUk: "Пшениця 11.5pro",
    nameEn: "Wheat 11.5% protein",
    sortOrder: 2,
    basePrice: 231,
  },
  {
    code: "FEED_WHT",
    nameUk: "Пшениця фураж",
    nameEn: "Feed wheat",
    sortOrder: 3,
    basePrice: 206,
  },
  {
    code: "GMO_SOY",
    nameUk: "Соя ГМО",
    nameEn: "GMO soybean",
    sortOrder: 4,
    basePrice: 418,
  },
];

const respondents = [
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

async function main() {
  const deliveryBasis = await prisma.deliveryBasis.upsert({
    where: { code: "FOB_BLACK_SEA" },
    update: {
      name: "FOB Black Sea",
      region: "Black Sea",
      status: "published",
    },
    create: {
      code: "FOB_BLACK_SEA",
      name: "FOB Black Sea",
      region: "Black Sea",
      status: "published",
    },
  });

  const commodityRecords = await Promise.all(
    commodities.map((commodity) =>
      prisma.commodity.upsert({
        where: { code: commodity.code },
        update: {
          nameUk: commodity.nameUk,
          nameEn: commodity.nameEn,
          status: "published",
          sortOrder: commodity.sortOrder,
        },
        create: {
          code: commodity.code,
          nameUk: commodity.nameUk,
          nameEn: commodity.nameEn,
          status: "published",
          sortOrder: commodity.sortOrder,
        },
      }),
    ),
  );

  const respondentRecords = await Promise.all(
    respondents.map((respondent) =>
      prisma.respondent.upsert({
        where: { id: respondent.id },
        update: {
          legalName: respondent.legalName,
          displayName: respondent.legalName,
          active: true,
        },
        create: {
          id: respondent.id,
          legalName: respondent.legalName,
          displayName: respondent.legalName,
          active: true,
        },
      }),
    ),
  );

  const basket = await prisma.basket.upsert({
    where: { code: "FOB_BLACK_SEA_DEMO" },
    update: {
      name: "FOB Black Sea Demo Basket",
      deliveryBasisId: deliveryBasis.id,
      weight: new Prisma.Decimal(1),
      active: true,
    },
    create: {
      code: "FOB_BLACK_SEA_DEMO",
      name: "FOB Black Sea Demo Basket",
      deliveryBasisId: deliveryBasis.id,
      weight: new Prisma.Decimal(1),
      active: true,
    },
  });

  await Promise.all(
    respondentRecords.map((respondent) =>
      prisma.basketRespondent.upsert({
        where: {
          basketId_respondentId: {
            basketId: basket.id,
            respondentId: respondent.id,
          },
        },
        update: {
          weight: new Prisma.Decimal(1),
          active: true,
        },
        create: {
          basketId: basket.id,
          respondentId: respondent.id,
          weight: new Prisma.Decimal(1),
          active: true,
        },
      }),
    ),
  );

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@uga-index.demo" },
    update: { name: "Demo Admin", role: "admin", active: true },
    create: {
      email: "admin@uga-index.demo",
      name: "Demo Admin",
      role: "admin",
      active: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "member@uga-index.demo" },
    update: { name: "Demo Member", role: "member", active: true },
    create: {
      email: "member@uga-index.demo",
      name: "Demo Member",
      role: "member",
      active: true,
    },
  });

  await Promise.all(
    respondentRecords.map((respondent, index) =>
      prisma.user.upsert({
        where: { email: `respondent-${index + 1}@uga-index.demo` },
        update: {
          name: `Respondent ${index + 1}`,
          role: "respondent",
          respondentId: respondent.id,
          active: true,
        },
        create: {
          email: `respondent-${index + 1}@uga-index.demo`,
          name: `Respondent ${index + 1}`,
          role: "respondent",
          respondentId: respondent.id,
          active: true,
        },
      }),
    ),
  );

  for (let dayOffset = 13; dayOffset >= 0; dayOffset -= 1) {
    const tradeDate = dateDaysBefore(dayOffset);

    for (const commodity of commodityRecords) {
      const commoditySeed = commodities.find(({ code }) => code === commodity.code);

      if (!commoditySeed) {
        continue;
      }

      const basePrice = commoditySeed.basePrice - dayOffset * 0.65;
      const submissions = await Promise.all(
        respondentRecords.map((respondent, respondentIndex) => {
          const price = roundMoney(basePrice + respondentIndex * 0.3 - 1.05);

          return prisma.priceSubmission.upsert({
            where: {
              tradeDate_commodityId_deliveryBasisId_respondentId_source: {
                tradeDate,
                commodityId: commodity.id,
                deliveryBasisId: deliveryBasis.id,
                respondentId: respondent.id,
                source: "respondent",
              },
            },
            update: {
              priceUsdPerMt: new Prisma.Decimal(price),
              status: "verified",
              submittedAt: noonUtc(tradeDate),
            },
            create: {
              tradeDate,
              commodityId: commodity.id,
              deliveryBasisId: deliveryBasis.id,
              respondentId: respondent.id,
              submittedById: adminUser.id,
              source: "respondent",
              status: "verified",
              priceUsdPerMt: new Prisma.Decimal(price),
              submittedAt: noonUtc(tradeDate),
            },
          });
        }),
      );

      await prisma.externalIndicative.upsert({
        where: {
          tradeDate_commodityId_deliveryBasisId_source: {
            tradeDate,
            commodityId: commodity.id,
            deliveryBasisId: deliveryBasis.id,
            source: "spike",
          },
        },
        update: {
          priceUsdPerMt: new Prisma.Decimal(roundMoney(basePrice + 0.4)),
          status: "submitted",
          receivedAt: noonUtc(tradeDate),
          metadata: { provider: "Spike Brokers", basis: "FOB Black Sea" },
        },
        create: {
          tradeDate,
          commodityId: commodity.id,
          deliveryBasisId: deliveryBasis.id,
          source: "spike",
          status: "submitted",
          priceUsdPerMt: new Prisma.Decimal(roundMoney(basePrice + 0.4)),
          receivedAt: noonUtc(tradeDate),
          metadata: { provider: "Spike Brokers", basis: "FOB Black Sea" },
        },
      });

      if (dayOffset >= 1 && dayOffset <= 7) {
        await seedPublishedIndex({
          adminUserId: adminUser.id,
          basketId: basket.id,
          basketWeight: basket.weight,
          commodityId: commodity.id,
          deliveryBasisId: deliveryBasis.id,
          submissions,
          tradeDate,
        });
      }
    }
  }

  await prisma.auditLog.create({
    data: {
      actorUserId: adminUser.id,
      actorRole: "admin",
      action: "seed.completed",
      entityType: "database",
      summary: "Seeded UGA Index demo data.",
      beforeJson: Prisma.JsonNull,
      afterJson: {
        commodities: commodityRecords.length,
        respondents: respondentRecords.length,
        daysOfSubmissions: 14,
        daysOfSpikeIndicatives: 14,
        daysOfPublishedIndices: 7,
      },
    },
  });
}

async function seedPublishedIndex({
  adminUserId,
  basketId,
  basketWeight,
  commodityId,
  deliveryBasisId,
  submissions,
  tradeDate,
}: {
  adminUserId: string;
  basketId: string;
  basketWeight: Prisma.Decimal;
  commodityId: string;
  deliveryBasisId: string;
  submissions: Array<{
    id: string;
    respondentId: string;
    priceUsdPerMt: Prisma.Decimal;
  }>;
  tradeDate: Date;
}) {
  const calculationResult = calculateIndexValue({
    date: isoDate(tradeDate),
    commodityId,
    deliveryBasisId,
    basketWeight: basketWeight.toNumber(),
    submissions: submissions.map((submission) => ({
      respondentId: submission.respondentId,
      price: submission.priceUsdPerMt.toNumber(),
    })),
  });

  const calculation = await prisma.indexCalculation.upsert({
    where: {
      tradeDate_commodityId_deliveryBasisId_basketId: {
        tradeDate,
        commodityId,
        deliveryBasisId,
        basketId,
      },
    },
    update: {
      status: "published",
      medianUsdPerMt:
        calculationResult.median === null
          ? null
          : new Prisma.Decimal(calculationResult.median),
      valueUsdPerMt:
        calculationResult.rawValue === null
          ? null
          : new Prisma.Decimal(calculationResult.rawValue),
      publicValueUsdPerMt:
        calculationResult.value === null
          ? null
          : new Prisma.Decimal(calculationResult.value),
      rawCount: calculationResult.rawCount,
      usedCount: calculationResult.usedCount,
      basketWeight,
      version: 1,
      calculatedById: adminUserId,
      calculatedAt: noonUtc(tradeDate),
    },
    create: {
      tradeDate,
      commodityId,
      deliveryBasisId,
      basketId,
      status: "published",
      medianUsdPerMt:
        calculationResult.median === null
          ? null
          : new Prisma.Decimal(calculationResult.median),
      valueUsdPerMt:
        calculationResult.rawValue === null
          ? null
          : new Prisma.Decimal(calculationResult.rawValue),
      publicValueUsdPerMt:
        calculationResult.value === null
          ? null
          : new Prisma.Decimal(calculationResult.value),
      rawCount: calculationResult.rawCount,
      usedCount: calculationResult.usedCount,
      basketWeight,
      version: 1,
      calculatedById: adminUserId,
      calculatedAt: noonUtc(tradeDate),
    },
  });

  await prisma.indexCalculationItem.deleteMany({
    where: { calculationId: calculation.id },
  });

  const excludedByRespondent = new Map(
    calculationResult.excluded.map((item) => [item.respondentId, item]),
  );

  await prisma.indexCalculationItem.createMany({
    data: submissions.map((submission) => {
      const excluded = excludedByRespondent.get(submission.respondentId);

      return {
        calculationId: calculation.id,
        priceSubmissionId: submission.id,
        respondentId: submission.respondentId,
        priceUsdPerMt: submission.priceUsdPerMt,
        included: !excluded,
        deviationPct: excluded
          ? new Prisma.Decimal(excluded.deviationPct)
          : new Prisma.Decimal(0),
        exclusionReason: excluded ? "outside_2pct_median_band" : null,
      };
    }),
  });

  if (calculationResult.value !== null) {
    const previous = await prisma.publishedIndex.findFirst({
      where: {
        tradeDate: { lt: tradeDate },
        commodityId,
        deliveryBasisId,
        basketId,
        status: "published",
        locked: true,
      },
      orderBy: { tradeDate: "desc" },
    });
    const change =
      previous === null
        ? { changeAbs: null, changePct: null }
        : computePublishedChange(
            calculationResult.value,
            previous.valueUsdPerMt.toNumber(),
          );

    await prisma.publishedIndex.upsert({
      where: {
        tradeDate_commodityId_deliveryBasisId_basketId: {
          tradeDate,
          commodityId,
          deliveryBasisId,
          basketId,
        },
      },
      update: {
        calculationId: calculation.id,
        status: "published",
        valueUsdPerMt: new Prisma.Decimal(calculationResult.value),
        changeAbsUsdPerMt:
          change.changeAbs === null ? null : new Prisma.Decimal(change.changeAbs),
        changePct:
          change.changePct === null ? null : new Prisma.Decimal(change.changePct),
        locked: true,
        publishedById: adminUserId,
        publishedAt: noonUtc(tradeDate),
      },
      create: {
        tradeDate,
        commodityId,
        deliveryBasisId,
        basketId,
        calculationId: calculation.id,
        status: "published",
        valueUsdPerMt: new Prisma.Decimal(calculationResult.value),
        changeAbsUsdPerMt:
          change.changeAbs === null ? null : new Prisma.Decimal(change.changeAbs),
        changePct:
          change.changePct === null ? null : new Prisma.Decimal(change.changePct),
        locked: true,
        publishedById: adminUserId,
        publishedAt: noonUtc(tradeDate),
      },
    });

    await prisma.auditLog.create({
      data: {
        actorUserId: adminUserId,
        actorRole: "admin",
        action: "index.published",
        entityType: "PublishedIndex",
        entityId: calculation.id,
        summary: `Published index for ${commodityId} on ${isoDate(tradeDate)}.`,
        beforeJson: Prisma.JsonNull,
        afterJson: {
          tradeDate: isoDate(tradeDate),
          commodityId,
          deliveryBasisId,
          valueUsdPerMt: calculationResult.value,
          changeAbsUsdPerMt: change.changeAbs,
          changePct: change.changePct,
          locked: true,
        },
      },
    });
  }
}

function dateDaysBefore(dayOffset: number) {
  return new Date(
    Date.UTC(
      BASE_DATE.getUTCFullYear(),
      BASE_DATE.getUTCMonth(),
      BASE_DATE.getUTCDate() - dayOffset,
    ),
  );
}

function noonUtc(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12),
  );
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function computePublishedChange(currentValue: number, previousValue: number) {
  const changeAbs = Math.round((currentValue - previousValue) * 10) / 10;
  const changePct = Math.round((changeAbs / previousValue) * 10000) / 100;

  return { changeAbs, changePct };
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
