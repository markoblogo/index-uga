"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, type Locale, locales } from "@/lib/i18n";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2" aria-label="Language switcher">
      {locales.map((item) => {
        const href = buildLocaleHref(pathname, item);

        return (
          <Link
            aria-current={item === locale ? "page" : undefined}
            className={
              item === locale
                ? "rounded-full bg-uga-dark px-3 py-2 text-xs font-semibold uppercase text-white"
                : "rounded-full border border-black/10 px-3 py-2 text-xs font-semibold uppercase text-black/60 transition hover:border-uga-green hover:text-uga-green"
            }
            href={href}
            key={item}
            onClick={() => setLocaleCookie(item)}
          >
            {item}
          </Link>
        );
      })}
    </div>
  );
}

function buildLocaleHref(pathname: string, nextLocale: Locale) {
  const segments = pathname.split("/");

  if (segments[1] && locales.includes(segments[1] as Locale)) {
    segments[1] = nextLocale;
    return segments.join("/") || `/${nextLocale}`;
  }

  return `/${nextLocale}`;
}

function setLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; Max-Age=31536000; Path=/; SameSite=Lax`;
}
