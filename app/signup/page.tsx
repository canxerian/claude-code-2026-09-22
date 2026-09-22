import { SignupForm } from './signup-form'

export default function SignupPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-xl font-semibold">Sign up</h1>
      <SignupForm />
    </div>
  )
}
