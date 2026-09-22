'use client'

import { useTransition } from 'react'
import { toggleHabitToday } from './actions'

export function HabitToggle({
  habitId,
  completed,
}: {
  habitId: string
  completed: boolean
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => toggleHabitToday(habitId))}
      aria-pressed={completed}
      className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-colors disabled:opacity-50 ${
        completed
          ? 'border-transparent bg-foreground text-background'
          : 'border-black/20 dark:border-white/30'
      }`}
    >
      {completed ? '✓' : ''}
    </button>
  )
}
