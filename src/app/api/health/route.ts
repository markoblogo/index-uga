import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hasDatabaseUrl } from "@/lib/admin-daily-inputs";

export const dynamic = "force-dynamic";

export async function GET() {
  const databaseConfigured = hasDatabaseUrl();
  let database: "configured" | "ok" | "unavailable" | "not_configured" =
    databaseConfigured ? "configured" : "not_configured";

  if (databaseConfigured) {
    try {
      await db.$queryRaw`SELECT 1`;
      database = "ok";
    } catch {
      database = "unavailable";
    }
  }

  return NextResponse.json(
    {
      ok: database !== "unavailable",
      service: "uga-index",
      timestamp: new Date().toISOString(),
      database,
      siteUrlConfigured: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
      status: database === "unavailable" ? 503 : 200,
    },
  );
}
