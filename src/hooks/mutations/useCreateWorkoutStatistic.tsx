import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { Database } from "../../types";
import { supabase } from "../../utils";

export const useCreateWorkoutStatistic = () => {
  const execute = async ({
    workout_id,
    completion_time,
  }: Database["public"]["Tables"]["workout_statistic"]["Insert"]) => {
    const res = await supabase.from("workout_statistic").insert({
      workout_id,
      completion_time,
    });

    if (res.error) {
      toast.error(res.error.message);
      throw new Error(res.error.message);
    }

    return res;
  };

  return useMutation({
    mutationFn: (item: Database["public"]["Tables"]["workout_statistic"]["Insert"]) =>
      execute(item),
    onSuccess: () => {
      toast.success("Workout recorded!");
    },
  });
};
