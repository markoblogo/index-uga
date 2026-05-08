import Link from "next/link";
import { requireDemoRole } from "@/lib/demo-auth";
import { todayInputDate } from "@/lib/admin-daily-inputs";
import {
  getRespondentSurveyData,
  getSurveyLabels,
  normalizeSurveyLocale,
  saveRespondentSurvey,
  type RespondentSurveyData,
} from "@/lib/respondent-survey";

type RespondentPageProps = {
  searchParams: Promise<{
    locale?: string;
    saved?: string;
  }>;
};

export default async function RespondentPage({
  searchParams,
}: RespondentPageProps) {
  const user = await requireDemoRole("respondent");
  const params = await searchParams;
  const locale = normalizeSurveyLocale(params.locale);
  const labels = getSurveyLabels(locale);
  const date = todayInputDate();
  const data = await getRespondentSurveyData({
    date,
    locale,
    respondentId: user.respondentId ?? "",
  });

  async function save(formData: FormData) {
    "use server";

    const currentUser = await requireDemoRole("respondent");
    await saveRespondentSurvey(formData, currentUser);
  }

  return (
    <section className="mx-auto grid max-w-3xl gap-5">
      <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-uga-green">
              {labels.badge}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              {labels.title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-black/65">
              {labels.intro}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              className={
                locale === "uk"
                  ? "rounded-full bg-uga-dark px-3 py-2 text-xs font-semibold uppercase text-white"
                  : "rounded-full border border-black/10 px-3 py-2 text-xs font-semibold uppercase text-black/60"
              }
              href="/respondent?locale=uk"
            >
              uk
            </Link>
            <Link
              className={
                locale === "en"
                  ? "rounded-full bg-uga-dark px-3 py-2 text-xs font-semibold uppercase text-white"
                  : "rounded-full border border-black/10 px-3 py-2 text-xs font-semibold uppercase text-black/60"
              }
              href="/respondent?locale=en"
            >
              en
            </Link>
          </div>
        </div>

        <dl className="mt-6 grid gap-3 rounded-2xl bg-uga-mist p-4 text-sm sm:grid-cols-2">
          <InfoItem label={labels.company} value={data.companyName} />
          <InfoItem label={labels.date} value={data.date} />
          <InfoItem label={labels.basis} value={data.basisLabel} />
          <InfoItem label={labels.source} value={data.source} />
        </dl>

        {params.saved ? (
          <div className="mt-5 rounded-2xl border border-uga-green/20 bg-uga-mist px-4 py-3 text-sm font-semibold text-uga-green">
            {params.saved === "submitted"
              ? labels.submitted
              : labels.draftSaved}
          </div>
        ) : null}
      </div>

      <form action={save} className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-sm">
        <input name="date" type="hidden" value={data.date} />
        <input name="locale" type="hidden" value={locale} />
        <div className="grid gap-4">
          {data.commodities.map((commodity) => (
            <label
              className="grid gap-3 rounded-2xl border border-black/10 p-4 sm:grid-cols-[1fr_12rem] sm:items-center"
              key={commodity.id}
            >
              <span>
                <span className="block text-base font-semibold text-uga-dark">
                  {commodity.name}
                </span>
                <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                  {commodity.code} · {data.basisLabel}
                </span>
              </span>
              <span className="grid gap-1">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                  {labels.price}
                </span>
                <input
                  className="rounded-xl border-black/15 px-4 py-3 text-base font-semibold focus:border-uga-green focus:ring-uga-green"
                  defaultValue={commodity.price ?? ""}
                  inputMode="decimal"
                  min="0"
                  name={`price:${commodity.id}`}
                  placeholder="USD/t"
                  step="0.01"
                  type="number"
                />
              </span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            className="rounded-full border border-black/15 px-5 py-3 text-sm font-semibold text-uga-dark transition hover:border-uga-green hover:text-uga-green"
            name="intent"
            type="submit"
            value="draft"
          >
            {labels.saveDraft}
          </button>
          <button
            className="rounded-full bg-uga-green px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-uga-dark"
            name="intent"
            type="submit"
            value="submit"
          >
            {labels.submit}
          </button>
        </div>
      </form>

      {data.status === "submitted" ? (
        <SubmittedValues data={data} title={labels.submittedMessage} />
      ) : null}
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
        {label}
      </dt>
      <dd className="mt-1 font-semibold text-uga-dark">{value}</dd>
    </div>
  );
}

function SubmittedValues({
  data,
  title,
}: {
  data: RespondentSurveyData;
  title: string;
}) {
  return (
    <section className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 grid gap-2">
        {data.commodities.map((commodity) => (
          <div
            className="flex items-center justify-between gap-4 rounded-xl bg-uga-mist px-4 py-3 text-sm"
            key={commodity.id}
          >
            <span className="font-semibold text-uga-dark">{commodity.name}</span>
            <span className="text-black/65">
              {commodity.price === null
                ? "missing"
                : `$${commodity.price.toFixed(2)} USD/t`}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
