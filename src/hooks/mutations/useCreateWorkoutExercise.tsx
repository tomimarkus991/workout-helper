import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { Database } from "@/types";
import { supabase } from "@/utils";

export const useCreateWorkoutExercise = () => {
  const execute = async ({
    exercise_id,
    workout_id,
  }: Database["public"]["Tables"]["workout_exercise"]["Insert"]) => {
    const res = await supabase.from("workout_exercise").insert({
      exercise_id,
      workout_id,
    });

    if (res.error) {
      toast.error(res.error.message);
      throw new Error(res.error.message);
    }

    return res;
  };

  return useMutation({
    mutationFn: (exercise: Database["public"]["Tables"]["workout_exercise"]["Insert"]) =>
      execute(exercise),
  });
};
