import { redirect } from "next/navigation";
import { clearDemoSession } from "@/lib/demo-auth";

export async function GET() {
  await clearDemoSession();
  redirect("/login");
}

export async function POST() {
  await clearDemoSession();
  redirect("/login");
}
