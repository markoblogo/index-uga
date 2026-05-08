import type { ReactNode } from "react";
import Link from "next/link";
import type { DemoUser } from "@/lib/demo-auth";

type InternalShellProps = {
  children: ReactNode;
  user: DemoUser;
};

const navByRole = {
  admin: [
    { href: "/admin", label: "Admin dashboard" },
    { href: "/admin/daily-inputs", label: "Daily input" },
    { href: "/admin/calculate", label: "Calculate & publish" },
  ],
  respondent: [
    { href: "/respondent", label: "Survey form" },
    { href: "/respondent", label: "My submissions" },
  ],
  member: [
    { href: "/member", label: "Member view" },
    { href: "/member", label: "Published indices" },
  ],
} as const;

export function InternalShell({ children, user }: InternalShellProps) {
  const navItems = navByRole[user.role];

  return (
    <div className="min-h-screen bg-uga-mist text-uga-dark">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="text-xl font-semibold tracking-tight"
                href={`/${user.role}`}
              >
                UGA Index
              </Link>
              <span className="rounded-full bg-uga-green px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                Demo mode
              </span>
            </div>
            <p className="mt-2 text-sm text-black/60">
              Signed in as {user.username} · {user.role}
              {user.respondentName ? ` · ${user.respondentName}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black/65 transition hover:border-uga-green hover:text-uga-green"
              href="/"
            >
              Public site
            </Link>
            <Link
              className="rounded-full bg-uga-dark px-4 py-2 text-sm font-semibold text-white transition hover:bg-uga-green"
              href="/logout"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[16rem_1fr] lg:px-8">
        <aside className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-black/40">
            Navigation
          </p>
          <nav className="mt-3 grid gap-1">
            {navItems.map((item) => (
              <Link
                className="rounded-xl px-3 py-2 text-sm font-semibold text-black/65 transition hover:bg-uga-mist hover:text-uga-green"
                href={item.href}
                key={item.label}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
