import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { archiveHabit, unarchiveHabit } from './actions'

export default async function HabitsPage() {
  const supabase = await createClient()
  const { data: habits } = await supabase
    .from('habits')
    .select('id, name, description, archived_at')
    .order('created_at', { ascending: true })

  const active = (habits ?? []).filter((h) => !h.archived_at)
  const archived = (habits ?? []).filter((h) => h.archived_at)

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Habits</h1>
        <Link href="/habits/new" className="text-sm underline underline-offset-4">
          New habit
        </Link>
      </div>

      <section className="flex flex-col gap-2">
        {active.length === 0 && (
          <p className="text-sm text-black/60 dark:text-white/60">No active habits.</p>
        )}
        {active.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center gap-4 rounded-md border border-black/10 p-3 dark:border-white/10"
          >
            <div className="flex-1">
              <p className="text-sm font-medium">{habit.name}</p>
              {habit.description && (
                <p className="text-xs text-black/60 dark:text-white/60">
                  {habit.description}
                </p>
              )}
            </div>
            <Link href={`/habits/${habit.id}/edit`} className="text-xs underline underline-offset-4">
              Edit
            </Link>
            <form action={archiveHabit.bind(null, habit.id)}>
              <button type="submit" className="text-xs underline underline-offset-4">
                Archive
              </button>
            </form>
          </div>
        ))}
      </section>

      {archived.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-black/60 dark:text-white/60">Archived</h2>
          {archived.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center gap-4 rounded-md border border-black/10 p-3 opacity-60 dark:border-white/10"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{habit.name}</p>
              </div>
              <form action={unarchiveHabit.bind(null, habit.id)}>
                <button type="submit" className="text-xs underline underline-offset-4">
                  Unarchive
                </button>
              </form>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
