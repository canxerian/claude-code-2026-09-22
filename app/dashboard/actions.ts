"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LogStepsState = {
  error?: string;
} | undefined;

export async function logSteps(
  _prevState: LogStepsState,
  formData: FormData,
): Promise<LogStepsState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const date = String(formData.get("date") ?? "");
  const stepCount = Number(formData.get("stepCount"));

  if (!date || !Number.isFinite(stepCount) || stepCount < 0) {
    return { error: "Enter a valid date and a non-negative step count." };
  }

  const { error } = await supabase
    .from("steps")
    .upsert(
      { user_id: user.id, date, step_count: stepCount },
      { onConflict: "user_id,date" },
    );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
}

export async function deleteSteps(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("steps").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/dashboard");
}
