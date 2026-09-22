import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-xl font-semibold">Log in</h1>
      <LoginForm />
    </div>
  )
}
