import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

import { Database } from "../../types";
import { supabase } from "../../utils";

export const useUpdateWorkout = () => {
  const navigate = useNavigate({ from: "/workout/$id" });
  const queryClient = useQueryClient();
  const execute = async ({
    workout_name,
    id,
    average_completion_time,
    image,
    complete_duration_exercise_on_end,
    profile_id,
    sequential_sets,
  }: Database["public"]["Tables"]["workout"]["Update"]) => {
    const res = await supabase
      .from("workout")
      .update({
        workout_name,
        average_completion_time,
        complete_duration_exercise_on_end,
        image,
        profile_id,
        sequential_sets,
      })
      .eq("id", id as string);

    if (res.error) {
      toast.error(res.error.message);
      throw new Error(res.error.message);
    }

    return res;
  };

  return useMutation({
    mutationFn: (workout: Database["public"]["Tables"]["workout"]["Update"]) => execute(workout),
    onSuccess: (_, { id }) => {
      console.log("workout", id);

      toast.success("Workout updated!");
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["get_workouts"],
        });
        navigate({ to: `/workout/${id}` as any });
      }, 200);
    },
  });
};
