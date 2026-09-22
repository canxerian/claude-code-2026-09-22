import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { computeCurrentStreak, todayDateString } from '@/lib/streaks'
import { HabitToggle } from './habit-toggle'

export default async function DashboardPage() {
  const supabase = await createClient()
  const today = todayDateString()

  const { data: habits } = await supabase
    .from('habits')
    .select('id, name, description')
    .is('archived_at', null)
    .order('created_at', { ascending: true })

  const habitIds = (habits ?? []).map((h) => h.id)

  const { data: logs } = habitIds.length
    ? await supabase
        .from('habit_logs')
        .select('habit_id, completed_on')
        .in('habit_id', habitIds)
    : { data: [] }

  const logsByHabit = new Map<string, string[]>()
  for (const log of logs ?? []) {
    const dates = logsByHabit.get(log.habit_id) ?? []
    dates.push(log.completed_on)
    logsByHabit.set(log.habit_id, dates)
  }

  if (!habits || habits.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-black/60 dark:text-white/60">
          You don&apos;t have any habits yet.
        </p>
        <Link href="/habits/new" className="underline underline-offset-4">
          Create your first habit
        </Link>
      </div>
    )
  }

  return (
    <div className="flex max-w-lg flex-col gap-3">
      <h1 className="text-lg font-semibold">Today</h1>
      <ul className="flex flex-col gap-2">
        {habits.map((habit) => {
          const dates = logsByHabit.get(habit.id) ?? []
          const completed = dates.includes(today)
          const streak = computeCurrentStreak(dates, today)

          return (
            <li
              key={habit.id}
              className="flex items-center gap-4 rounded-md border border-black/10 p-3 dark:border-white/10"
            >
              <HabitToggle habitId={habit.id} completed={completed} />
              <div className="flex-1">
                <p className="text-sm font-medium">{habit.name}</p>
                {habit.description && (
                  <p className="text-xs text-black/60 dark:text-white/60">
                    {habit.description}
                  </p>
                )}
              </div>
              {streak > 0 && (
                <span className="text-sm text-black/60 dark:text-white/60">
                  🔥 {streak}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
