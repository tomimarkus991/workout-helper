import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { supabase } from "@/utils";

export const useGetWorkout = (workoutId: string) => {
  const getQuery = async () => {
    const { data, error } = await supabase
      .from("workout")
      .select(
        `
        *,
        exercise (
          *
        )

    `,
      )
      .eq("id", workoutId)
      .single();

    if (error) {
      toast.error(`Error getting workout: ${error.message}`);
      throw new Error(error.message);
    }

    return data;
  };

  return useQuery({ queryKey: ["get_workout", { workoutId }], queryFn: async () => getQuery() });
};
