import { NextResponse } from "next/server";
import { getPublicLatestData } from "@/lib/public-api-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getPublicLatestData();

  return NextResponse.json(
    {
      data,
      generatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    },
  );
}
