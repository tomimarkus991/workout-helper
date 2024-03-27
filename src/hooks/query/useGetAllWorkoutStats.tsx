import { useQuery } from "@tanstack/react-query";
import { endOfWeek, startOfWeek } from "date-fns";
import { toast } from "react-hot-toast";

import { supabase } from "../../utils";

/**
 * Gets current weeks workout stats
 */
export const useGetAllWorkoutsStats = () => {
  const getQuery = async () => {
    const { data: user } = await supabase.auth.getSession();

    if (!user.session) {
      return [];
    }

    const { data, error } = await supabase
      .from("workout_statistic")
      .select(
        `
        *,
        workout (
          workout_name
        )
      `,
      )
      .eq("workout.profile_id", user?.session?.user.id as string)
      .lte("created_at", endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString())
      .gte("created_at", startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString());

    if (error) {
      toast.error(`Error getting workout stats: ${error.message}`);
      throw new Error(error.message);
    }

    return data || [];
  };

  return useQuery({ queryKey: ["get_workout_stats"], queryFn: async () => getQuery() });
};
