'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createHabit(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const color = String(formData.get('color') ?? '').trim()
  if (!name) return

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('habits').insert({
    user_id: user.id,
    name,
    description: description || null,
    color: color || null,
  })

  revalidatePath('/habits')
  revalidatePath('/dashboard')
  redirect('/habits')
}

export async function updateHabit(habitId: string, formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const color = String(formData.get('color') ?? '').trim()
  if (!name) return

  const supabase = await createClient()
  await supabase
    .from('habits')
    .update({ name, description: description || null, color: color || null })
    .eq('id', habitId)

  revalidatePath('/habits')
  revalidatePath('/dashboard')
  redirect('/habits')
}

export async function archiveHabit(habitId: string) {
  const supabase = await createClient()
  await supabase
    .from('habits')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', habitId)

  revalidatePath('/habits')
  revalidatePath('/dashboard')
}

export async function unarchiveHabit(habitId: string) {
  const supabase = await createClient()
  await supabase.from('habits').update({ archived_at: null }).eq('id', habitId)

  revalidatePath('/habits')
  revalidatePath('/dashboard')
}
