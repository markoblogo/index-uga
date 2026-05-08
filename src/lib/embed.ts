import { isLocale, type Locale } from "@/lib/i18n";

export type EmbedLayout = "cards" | "compact";
export type EmbedTheme = "light";

export function normalizeEmbedLocale(value: string | undefined): Locale {
  return value && isLocale(value) ? value : "en";
}

export function normalizeEmbedLayout(value: string | undefined): EmbedLayout {
  return value === "compact" ? "compact" : "cards";
}

export function normalizeEmbedTheme(): EmbedTheme {
  return "light";
}
