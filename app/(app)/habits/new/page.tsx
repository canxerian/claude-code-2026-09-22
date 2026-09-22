import { createHabit } from '../actions'

export default function NewHabitPage() {
  return (
    <div className="flex max-w-sm flex-col gap-4">
      <h1 className="text-lg font-semibold">New habit</h1>
      <form action={createHabit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
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
            placeholder="#6366f1"
            className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background"
        >
          Create habit
        </button>
      </form>
    </div>
  )
}
