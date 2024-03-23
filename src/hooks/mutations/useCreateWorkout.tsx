import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

import { Database } from "../../types";
import { supabase } from "../../utils";

export const useCreateWorkout = () => {
  const navigate = useNavigate({ from: "/create-workout" });
  const queryClient = useQueryClient();
  const execute = async ({
    workout_name,
    id,
    average_completion_time,
    image,
    complete_duration_exercise_on_end,
    profile_id,
    sequential_sets,
  }: Database["public"]["Tables"]["workout"]["Insert"]) => {
    const res = await supabase.from("workout").insert({
      id,
      workout_name,
      average_completion_time,
      complete_duration_exercise_on_end,
      image,
      profile_id,
      sequential_sets,
    });

    if (res.error) {
      toast.error(res.error.message);
      throw new Error(res.error.message);
    }

    return res;
  };

  return useMutation({
    mutationFn: (workout: Database["public"]["Tables"]["workout"]["Insert"]) => execute(workout),
    onSuccess: () => {
      toast.success("New workout created!");
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["get_workouts"],
        });
        navigate({ to: "/" });
      }, 200);
    },
  });
};
