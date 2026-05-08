import type { ReactNode } from "react";
import { InternalShell } from "@/components/layout/internal-shell";
import { requireDemoRole } from "@/lib/demo-auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireDemoRole("admin");

  return <InternalShell user={user}>{children}</InternalShell>;
}
