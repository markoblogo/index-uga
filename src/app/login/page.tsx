import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  isDemoRole,
  setDemoSession,
  type DemoRole,
} from "@/lib/demo-auth";
import { respondents } from "@/lib/mock-data";

export default function LoginPage() {
  async function login(formData: FormData) {
    "use server";

    const username = String(formData.get("username") ?? "");
    const roleValue = formData.get("role");
    const role: DemoRole = isDemoRole(roleValue) ? roleValue : "member";
    const selectedRespondentId = String(formData.get("respondentId") ?? "");
    const respondentId =
      role === "respondent"
        ? selectedRespondentId || respondents[0]?.id
        : undefined;

    await setDemoSession({
      username,
      role,
      respondentId,
    });

    redirect(`/${role}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-uga-mist px-6 py-12">
      <section className="w-full max-w-xl rounded-[2rem] border border-black/10 bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-uga-green">
          Demo access
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-uga-dark">
          Sign in to UGA Index
        </h1>
        <p className="mt-3 text-sm leading-6 text-black/65">
          Authentication is mocked for this demo. Any username and password is
          accepted; choose the role you want to preview.
        </p>
        <form action={login} className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-uga-dark">
            Username
            <input
              className="rounded-xl border-black/15 bg-white px-4 py-3 text-base"
              name="username"
              placeholder="admin"
              type="text"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-uga-dark">
            Password
            <input
              className="rounded-xl border-black/15 bg-white px-4 py-3 text-base"
              name="password"
              placeholder="password"
              type="password"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-uga-dark">
            Role
            <select
              className="rounded-xl border-black/15 bg-white px-4 py-3 text-base"
              defaultValue="admin"
              name="role"
            >
              <option value="admin">admin</option>
              <option value="respondent">respondent</option>
              <option value="member">member</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-uga-dark">
            Respondent company
            <select
              className="rounded-xl border-black/15 bg-white px-4 py-3 text-base"
              name="respondentId"
            >
              {respondents.map((respondent) => (
                <option key={respondent.id} value={respondent.id}>
                  {respondent.legalName}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit">Continue demo</Button>
        </form>
        <Link
          className="mt-6 inline-flex text-sm font-semibold text-uga-green hover:text-uga-dark"
          href="/"
        >
          Back to public site
        </Link>
      </section>
    </main>
  );
}
