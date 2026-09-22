import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from './actions'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/10">
        <div className="flex items-center gap-6">
          <span className="font-semibold">Habits</span>
          <nav className="flex gap-4 text-sm">
            <Link href="/dashboard">Today</Link>
            <Link href="/habits">Habits</Link>
          </nav>
        </div>
        <form action={signOut}>
          <button type="submit" className="text-sm underline underline-offset-4">
            Log out
          </button>
        </form>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
