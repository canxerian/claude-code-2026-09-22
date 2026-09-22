import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateHabit } from '../../actions'

export default async function EditHabitPage(
  props: PageProps<'/habits/[id]/edit'>
) {
  const { id } = await props.params

  const supabase = await createClient()
  const { data: habit } = await supabase
    .from('habits')
    .select('id, name, description, color')
    .eq('id', id)
    .single()

  if (!habit) {
    notFound()
  }

  const updateHabitWithId = updateHabit.bind(null, habit.id)

  return (
    <div className="flex max-w-sm flex-col gap-4">
      <h1 className="text-lg font-semibold">Edit habit</h1>
      <form action={updateHabitWithId} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={habit.name}
            className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium">
            Description (optional)
          </label>
          <input
            id="description"
            name="description"
            defaultValue={habit.description ?? ''}
            className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="color" className="text-sm font-medium">
            Color (optional)
          </label>
          <input
            id="color"
            name="color"
            defaultValue={habit.color ?? ''}
            placeholder="#6366f1"
            className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background"
        >
          Save changes
        </button>
      </form>
    </div>
  )
}
