import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { supabase } from "../../utils";

export const useGetWorkoutStats = (workoutId: string) => {
  const getQuery = async () => {
    const { data, error } = await supabase
      .from("workout_statistic")
      .select(
        `
      *
      `,
      )
      .eq("workout_id", workoutId);

    if (error) {
      toast.error(`Error getting workout stats: ${error.message}`);
      throw new Error(error.message);
    }

    return data || [];
  };

  return useQuery({ queryKey: ["get_workout_stats"], queryFn: async () => getQuery() });
};
