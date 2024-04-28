import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { supabase } from "../../utils";

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
      .eq("is_archived", false)
      .order("order", { referencedTable: "exercise", ascending: true })
      .single();

    if (error) {
      toast.error(`Error getting workout: ${error.message}`);
      throw new Error(error.message);
    }

    const modifiedExercises: typeof data.exercise = [];
    if (data.sequential_sets) {
      data.exercise.map(exercise => {
        for (let setCount = 1; setCount <= exercise.sets; setCount++) {
          modifiedExercises.push({
            ...exercise,
            sets: setCount,
          });
        }
        return exercise;
      });
    } else {
      const howManySets = data.exercise.reduce((acc, exercise) => {
        return acc + exercise.sets;
      }, 0);

      for (let index = 0; index < howManySets; index++) {
        const exerciseIndex = index % data.exercise.length;
        const exercise = data.exercise[exerciseIndex];
        const sets = Math.floor(index / data.exercise.length) + 1;
        modifiedExercises.push({
          ...exercise,
          sets,
        });
      }
    }

    return {
      ...data,
      modifiedExercises,
    };
  };

  return useQuery({ queryKey: ["get_workout", { workoutId }], queryFn: async () => getQuery() });
};
