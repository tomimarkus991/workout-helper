/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { intervalToDuration, secondsToMinutes } from "date-fns";
import { useField } from "formik";
import { HiX } from "react-icons/hi";

import { useDeleteAllWorkoutExercises } from "../../hooks/mutations/useDeleteAllWorkoutExercises";
import { useDeleteExercise } from "../../hooks/mutations/useDeleteExercise";

interface Props {
  sets: number;
  reps: number | string;
  rest: number;
  duration: number;
  name: string;
  setIsEditingExercise?: (isEditingExercise: boolean) => void;
  exerciseId?: string;
  workoutId?: string;
}

export const ExerciseCard = ({ duration, reps, rest, sets, name }: Props) => {
  const { minutes, seconds } = intervalToDuration({
    start: 0,
    end: rest * 1000,
  });

  return (
    <div className="p-2 border border-blue-600 rounded-lg whitespace-nowrap">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <p>{sets}x</p>
          <p>
            {(reps === 0 || reps === "") && duration > 0
              ? `${duration}s`
              : `${reps === 999 ? "Max" : reps} reps`}
          </p>
          <p className="ml-3 mr-2 whitespace-normal">{name}</p>
        </div>
        <div className="flex flex-row items-center justify-center">
          {rest <= 60 ? (
            <p>{rest}s rest</p>
          ) : (
            <p>
              {minutes}m {String(seconds).padStart(2, "0")}s rest
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const FormikExerciseCard = ({
  name,
  sets,
  reps,
  rest,
  duration,
  setIsEditingExercise,
  exerciseId,
  workoutId,
}: Props) => {
  // @ts-ignore
  const [field, _, { setValue }] = useField("exercises");

  const [__, ___, { setValue: setExerciseValue }] = useField("exercise");
  const [____, _____, { setValue: setSetsValue }] = useField("sets");
  const [______, _______, { setValue: setRepsValue }] = useField("reps");
  const [________, _________, { setValue: setRestValue }] = useField("rest");
  const [__________, ___________, { setValue: setDurationValue }] = useField("duration");
  const [____________, _____________, { setValue: setExerciseId }] = useField("exerciseId");

  const { mutate: deleteAllWorkoutExercises } = useDeleteAllWorkoutExercises();
  const { mutate: deleteExercise } = useDeleteExercise();

  const handleCardClick = () => {
    setExerciseValue(name);
    setSetsValue(sets);
    setRepsValue(reps);
    setRestValue(rest);
    setDurationValue(duration);
    setExerciseId(exerciseId);

    setIsEditingExercise && setIsEditingExercise(true);
  };

  return (
    <div
      key={exerciseId}
      className="flex flex-row border border-blue-600 rounded-lg whitespace-nowrap"
    >
      <div className="flex flex-row items-center justify-between w-full" onClick={handleCardClick}>
        <div className="flex flex-row items-center p-2">
          <p>{sets}x</p>
          <p>
            {(reps === 0 || reps === "") && duration > 0
              ? `${duration}s`
              : `${reps === 999 ? "Max" : reps} reps`}
          </p>
          <p className="ml-3 mr-2 whitespace-normal">{name}</p>
        </div>
        <div className="flex flex-row items-center justify-center">
          {rest < 60 ? <p>{rest}s rest</p> : <p>{secondsToMinutes(rest)}m rest</p>}
        </div>
      </div>

      <div className="flex items-center justify-center">
        <HiX
          className="ml-2 mr-1 size-8 icon"
          onClick={() => {
            if (field.value.length === 1) {
              setValue([]);

              workoutId && deleteAllWorkoutExercises({ id: workoutId });
            } else {
              setValue([
                ...field.value.filter(
                  (exercise: { exerciseId: string }) => exercise.exerciseId !== exerciseId,
                ),
              ]);
              exerciseId && deleteExercise({ id: exerciseId });
            }
          }}
        />
      </div>
    </div>
  );
};
