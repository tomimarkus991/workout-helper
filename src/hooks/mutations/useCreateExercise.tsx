import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { Database } from "@/types";
import { supabase } from "@/utils";

export const useCreateExercise = () => {
  const execute = async ({
    id,
    exercise_name,
    order,
    reps,
    sets,
    rest,
    duration,
  }: Database["public"]["Tables"]["exercise"]["Insert"]) => {
    const res = await supabase.from("exercise").insert({
      id,
      exercise_name,
      order,
      reps,
      sets,
      rest,
      duration,
    });

    if (res.error) {
      toast.error(res.error.message);
      throw new Error(res.error.message);
    }

    return res;
  };

  return useMutation({
    mutationFn: (exercise: Database["public"]["Tables"]["exercise"]["Insert"]) => execute(exercise),
  });
};
