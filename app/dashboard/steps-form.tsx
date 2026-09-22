"use client";

import { useActionState } from "react";
import { logSteps, type LogStepsState } from "./actions";

const initialState: LogStepsState = undefined;

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function StepsForm() {
  const [state, action, pending] = useActionState(logSteps, initialState);

  return (
    <form
      action={action}
      className="flex flex-col gap-4 rounded-xl border border-black/[.08] p-6 dark:border-white/[.145] sm:flex-row sm:items-end"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="date" className="text-sm font-medium">
          Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          defaultValue={today()}
          max={today()}
          className="rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/[.145]"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="stepCount" className="text-sm font-medium">
          Steps
        </label>
        <input
          id="stepCount"
          name="stepCount"
          type="number"
          inputMode="numeric"
          min={0}
          required
          placeholder="e.g. 8000"
          className="rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/[.145]"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {pending ? "Saving…" : "Log steps"}
      </button>

      {state?.error && (
        <p className="text-sm text-red-600 sm:ml-2 dark:text-red-400">
          {state.error}
        </p>
      )}
    </form>
  );
}
