'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type SignupFormState =
  | { error: string }
  | { message: string }
  | undefined

export async function signup(
  _prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Enter your email and password.' }
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { error: error.message }
  }

  // If the project requires email confirmation, signUp() returns a user
  // but no active session yet — send them to check their inbox instead
  // of redirecting straight into the app.
  if (!data.session) {
    return { message: 'Check your email to confirm your account before signing in.' }
  }

  redirect('/dashboard')
}
