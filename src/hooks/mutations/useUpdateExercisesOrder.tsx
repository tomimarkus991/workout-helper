import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { supabase } from "../../utils";

interface Order {
  id: string;
  order: number;
}

interface Props {
  exercises: Order[];
}

export const useUpdateExercisesOrder = () => {
  const execute = async ({ exercises }: Props) => {
    const res = await supabase.from("exercise").upsert(exercises as any);

    if (res.error) {
      toast.error(res.error.message);
      throw new Error(res.error.message);
    }

    return res;
  };

  return useMutation({
    mutationFn: (exercise: Props) => execute(exercise),
    onSuccess: () => {
      toast.success("Exercises order updated!");
    },
  });
};
