import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";
import { deleteSteps } from "./actions";
import { StepsForm } from "./steps-form";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: steps } = await supabase
    .from("steps")
    .select("id, date, step_count")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(30);

  const entries = steps ?? [];
  const totalSteps = entries.reduce((sum, entry) => sum + entry.step_count, 0);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Health</h1>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-black/[.08] px-4 py-1.5 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
            >
              Log out
            </button>
          </form>
        </header>

        <div className="rounded-xl border border-black/[.08] p-6 dark:border-white/[.145]">
          <p className="text-sm text-zinc-500">Steps (last 30 entries)</p>
          <p className="text-3xl font-semibold tracking-tight">
            {totalSteps.toLocaleString()}
          </p>
        </div>

        <StepsForm />

        <div className="rounded-xl border border-black/[.08] dark:border-white/[.145]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/[.08] text-left text-zinc-500 dark:border-white/[.145]">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Steps</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-zinc-500"
                  >
                    No steps logged yet.
                  </td>
                </tr>
              )}
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-black/[.08] last:border-0 dark:border-white/[.145]"
                >
                  <td className="px-4 py-3">{entry.date}</td>
                  <td className="px-4 py-3">
                    {entry.step_count.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteSteps}>
                      <input type="hidden" name="id" value={entry.id} />
                      <button
                        type="submit"
                        className="text-zinc-500 hover:text-red-600 dark:hover:text-red-400"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
