function addDays(dateStr: string, delta: number): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + delta)
  return date.toISOString().slice(0, 10)
}

/**
 * Walks backward from `today` counting a consecutive run of completed
 * dates. If today isn't checked in yet, the streak still counts from
 * yesterday so it doesn't visually drop before the user has a chance to
 * check in today.
 */
export function computeCurrentStreak(
  completedDates: string[],
  today: string
): number {
  const completed = new Set(completedDates)

  let cursor = completed.has(today) ? today : addDays(today, -1)
  let streak = 0

  while (completed.has(cursor)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }

  return streak
}

export function todayDateString(): string {
  return new Date().toISOString().slice(0, 10)
}
