import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const params = await searchParams;
  const checkEmail = params?.checkEmail === "1";

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-4 py-16 dark:bg-black">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Health</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Track your daily walking steps.
        </p>
      </div>

      {checkEmail && (
        <p className="max-w-sm text-center text-sm text-zinc-600 dark:text-zinc-400">
          Check your email to confirm your account before logging in.
        </p>
      )}

      <LoginForm />
    </div>
  );
}
