import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

import { supabase } from "../../utils";

interface Props {
  id: string;
}

export const useArchiveWorkout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const execute = async ({ id }: Props) => {
    const res = await supabase.from("workout").update({ is_archived: true }).match({ id });

    if (res.error) {
      toast.error(res.error.message);
      throw new Error(res.error.message);
    }

    return res;
  };

  return useMutation({
    mutationFn: (user: Props) => execute(user),
    onSuccess: () => {
      toast.success("Workout archived successfully!");
      queryClient.invalidateQueries({
        queryKey: ["get_workouts"],
      });
      navigate({ to: "/" });
      //   setTimeout(() => {
      //   }, 200);
    },
  });
};
