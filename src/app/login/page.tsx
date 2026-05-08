import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authenticateDemoUser } from "@/lib/demo-allowlist";
import { getCurrentDemoUser, getRoleHome, setDemoSession } from "@/lib/demo-auth";
import { isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    locale?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [params, cookieStore, currentUser] = await Promise.all([
    searchParams,
    cookies(),
    getCurrentDemoUser(),
  ]);
  const locale = resolveLoginLocale(params.locale, cookieStore.get(LOCALE_COOKIE)?.value);
  const copy = loginCopy[locale];

  if (currentUser) {
    redirect(getRoleHome(currentUser.role));
  }

  async function login(formData: FormData) {
    "use server";

    const loginValue = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const localeValue = String(formData.get("locale") ?? "en");
    const resolvedLocale = resolveLoginLocale(localeValue);
    const user = authenticateDemoUser({ login: loginValue, password });

    if (!user) {
      redirect(`/login?locale=${resolvedLocale}&error=invalid`);
    }

    await setDemoSession(user);
    redirect(getRoleHome(user.role));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-uga-mist px-5 py-10 text-black">
      <section className="w-full max-w-[440px] border border-black bg-white">
        <div className="border-b border-black p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-uga-green">
            UGA Index
          </p>
          <h1 className="mt-3 text-3xl font-black uppercase leading-tight tracking-normal text-black">
            {copy.title}
          </h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-black/65">
            {copy.helper}
          </p>
        </div>

        <form action={login} className="grid gap-4 p-5">
          <input name="locale" type="hidden" value={locale} />
          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.12em] text-black/55">
            {copy.email}
            <input
              autoComplete="username"
              className="border border-black bg-white px-3 py-3 text-base font-semibold normal-case tracking-normal text-black outline-none transition focus:border-uga-green"
              name="email"
              placeholder="admin@uga.ua"
              required
              type="text"
            />
          </label>
          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.12em] text-black/55">
            {copy.password}
            <input
              autoComplete="current-password"
              className="border border-black bg-white px-3 py-3 text-base font-semibold normal-case tracking-normal text-black outline-none transition focus:border-uga-green"
              name="password"
              placeholder="••••••••"
              required
              type="password"
            />
          </label>

          {params.error === "invalid" ? (
            <p className="border border-red-700 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {copy.error}
            </p>
          ) : null}

          <Button className="w-full" type="submit">
            {copy.submit}
          </Button>
        </form>

        <div className="border-t border-black px-5 py-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-black/45">
            {copy.demoTitle}
          </p>
          <div className="mt-2 grid gap-1 text-xs font-semibold leading-5 text-black/60">
            <p>{copy.adminCredentials}</p>
            <p>{copy.respondentCredentials}</p>
          </div>
          <Link
            className="mt-4 inline-flex text-sm font-black text-uga-green underline-offset-4 transition hover:text-black hover:underline"
            href={`/${locale}`}
          >
            {copy.back}
          </Link>
        </div>
      </section>
    </main>
  );
}

function resolveLoginLocale(...values: Array<string | undefined>): Locale {
  for (const value of values) {
    if (value && isLocale(value)) {
      return value;
    }
  }

  return "en";
}

const loginCopy: Record<
  Locale,
  {
    adminCredentials: string;
    back: string;
    demoTitle: string;
    email: string;
    error: string;
    helper: string;
    password: string;
    respondentCredentials: string;
    submit: string;
    title: string;
  }
> = {
  en: {
    adminCredentials: "Admin: admin@uga.ua / admin",
    back: "Back to public site",
    demoTitle: "Demo access",
    email: "Email",
    error: "Invalid demo credentials.",
    helper: "Use demo credentials to preview administrator or respondent workflows.",
    password: "Password",
    respondentCredentials: "Respondent: bunge@uga-index.demo / respondent",
    submit: "Sign in",
    title: "Sign in to UGA Index",
  },
  uk: {
    adminCredentials: "Адміністратор: admin@uga.ua / admin",
    back: "Назад до публічного сайту",
    demoTitle: "Демо-доступ",
    email: "Email",
    error: "Невірні демо-дані для входу.",
    helper:
      "Використайте демо-доступ для перегляду сценарію адміністратора або респондента.",
    password: "Пароль",
    respondentCredentials: "Респондент: bunge@uga-index.demo / respondent",
    submit: "Увійти",
    title: "Вхід до UGA Index",
  },
};
