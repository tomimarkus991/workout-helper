import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

import { Database } from "@/types";
import { supabase } from "@/utils";

interface Props {
  id: string;
}

export const useDeleteWorkout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const execute = async ({ id }: Props) => {
    const { data } = await supabase
      .from("workout")
      .select(
        `
        exercise (
          *
        )

    `,
      )
      .eq("id", id)
      .single();

    data?.exercise.forEach(async (exercise: Database["public"]["Tables"]["exercise"]["Row"]) => {
      const exerciseRes = await supabase.from("exercise").delete().match({ id: exercise.id });

      if (exerciseRes.error) {
        toast.error(exerciseRes.error.message);
        throw new Error(exerciseRes.error.message);
      }
    });

    const res = await supabase.from("workout").delete().match({ id });

    if (res.error) {
      toast.error(res.error.message);
      throw new Error(res.error.message);
    }

    return res;
  };

  return useMutation({
    mutationFn: (user: Props) => execute(user),
    onSuccess: () => {
      toast.success("Exercise deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["get_workouts"],
      });
      navigate({ to: "/" });
      //   setTimeout(() => {
      //   }, 200);
    },
  });
};
