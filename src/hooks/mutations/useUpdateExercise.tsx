import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { Database } from "../../types";
import { supabase } from "../../utils";

export const useUpdateExercise = () => {
  const execute = async ({
    id,
    exercise_name,
    order,
    reps,
    sets,
    rest,
    duration,
  }: Database["public"]["Tables"]["exercise"]["Update"]) => {
    const res = await supabase
      .from("exercise")
      .update({
        exercise_name,
        order,
        reps,
        sets,
        rest,
        duration,
      })
      .eq("id", id as string);

    if (res.error) {
      toast.error(res.error.message);
      throw new Error(res.error.message);
    }

    return res;
  };

  return useMutation({
    mutationFn: (exercise: Database["public"]["Tables"]["exercise"]["Update"]) => execute(exercise),
  });
};
