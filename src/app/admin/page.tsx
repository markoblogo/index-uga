export default function AdminPage() {
  return (
    <section className="rounded-[1.5rem] border border-black/10 bg-white p-7 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-uga-green">
        Admin
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Daily index control room
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-black/65">
        This protected demo area is reserved for admin users. Future screens
        will include the respondent input matrix, calculation preview, publish
        action, and audit log review.
      </p>
    </section>
  );
}
