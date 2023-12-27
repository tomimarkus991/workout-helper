import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { supabase } from "@/utils";

export const useGetWorkouts = () => {
  const getQuery = async () => {
    const { data: user } = await supabase.auth.getSession();

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from("workout")
      .select("*")
      .eq("profile_id", user?.session?.user.id as string);

    if (error) {
      toast.error(`Error getting workouts: ${error.message}`);
      throw new Error(error.message);
    }

    return data || [];
  };

  return useQuery({ queryKey: ["get_workouts"], queryFn: async () => getQuery() });
};
