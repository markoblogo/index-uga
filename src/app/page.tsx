import { cookies } from "next/headers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  detectLocaleFromCountry,
  isLocale,
  LOCALE_COOKIE,
} from "@/lib/i18n";

export default async function HomeRedirect() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;

  if (cookieLocale && isLocale(cookieLocale)) {
    redirect(`/${cookieLocale}`);
  }

  const locale = detectLocaleFromCountry(getCountryHeader(headerStore));

  redirect(`/${locale}`);
}

function getCountryHeader(headerStore: Headers) {
  return (
    headerStore.get("x-vercel-ip-country") ??
    headerStore.get("cf-ipcountry") ??
    headerStore.get("cloudfront-viewer-country") ??
    headerStore.get("x-country") ??
    headerStore.get("x-country-code")
  );
}
