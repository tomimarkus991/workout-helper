import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { supabase } from "../../utils";

interface Props {
  id: string;
}

export const useDeleteExercise = () => {
  const execute = async ({ id }: Props) => {
    const res = await supabase.from("exercise").delete().match({ id });

    if (res.error) {
      toast.error(res.error.message);
      throw new Error(res.error.message);
    }

    return res;
  };

  return useMutation({
    mutationFn: (data: Props) => execute(data),
  });
};
