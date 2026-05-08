import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://user:password@localhost:5432/uga_index?schema=public",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
