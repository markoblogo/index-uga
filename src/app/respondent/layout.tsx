import type { ReactNode } from "react";
import { InternalShell } from "@/components/layout/internal-shell";
import { requireDemoRole } from "@/lib/demo-auth";

export default async function RespondentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireDemoRole("respondent");

  return <InternalShell user={user}>{children}</InternalShell>;
}
