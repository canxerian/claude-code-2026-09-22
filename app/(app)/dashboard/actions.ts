'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { todayDateString } from '@/lib/streaks'

export async function toggleHabitToday(habitId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const today = todayDateString()

  const { data: existing } = await supabase
    .from('habit_logs')
    .select('id')
    .eq('habit_id', habitId)
    .eq('completed_on', today)
    .maybeSingle()

  if (existing) {
    await supabase.from('habit_logs').delete().eq('id', existing.id)
  } else {
    await supabase.from('habit_logs').insert({
      habit_id: habitId,
      user_id: user.id,
      completed_on: today,
    })
  }

  revalidatePath('/dashboard')
}
