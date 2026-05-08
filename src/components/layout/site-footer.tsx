import { SITE_CONFIG } from "@/lib/constants";
import { getDictionary, type Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <footer className="border-t border-black/10 bg-uga-dark text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>
          {SITE_CONFIG.name} · {dict.footer.rights}
        </p>
        <p>{dict.footer.partners}</p>
      </div>
    </footer>
  );
}
