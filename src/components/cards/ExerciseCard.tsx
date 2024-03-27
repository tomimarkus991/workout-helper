/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { secondsToMinutes } from "date-fns";
import { useField } from "formik";
import { HiX } from "react-icons/hi";

interface Props {
  sets: number;
  reps: number | string;
  rest: number;
  duration: number;
  name: string;
  order: number | string;
  setIsEditingExercise?: (isEditingExercise: boolean) => void;
}

export const ExerciseCard = ({ duration, reps, rest, sets, name }: Props) => {
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
          {rest < 60 ? <p>{rest}s rest</p> : <p>{secondsToMinutes(rest)}m rest</p>}
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
  order,
  setIsEditingExercise,
}: Props) => {
  // @ts-ignore
  const [field, _, { setValue }] = useField("exercises");

  const [__, ___, { setValue: setExerciseValue }] = useField("exercise");
  const [____, _____, { setValue: setSetsValue }] = useField("sets");
  const [______, _______, { setValue: setRepsValue }] = useField("reps");
  const [________, _________, { setValue: setRestValue }] = useField("rest");
  const [__________, ___________, { setValue: setDurationValue }] = useField("duration");

  const handleCardClick = () => {
    setExerciseValue(name);
    setSetsValue(sets);
    setRepsValue(reps);
    setRestValue(rest);
    setDurationValue(duration);

    setIsEditingExercise && setIsEditingExercise(true);
  };

  return (
    <div className="border border-blue-600 rounded-lg whitespace-nowrap">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center p-2" onClick={handleCardClick}>
          <p className="mr-2 text-zinc-500 opacity-90">{order}</p>
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
          <HiX
            className="ml-2 mr-1 size-8 icon"
            onClick={() => {
              if (field.value.length === 1) {
                setValue([]);
              } else {
                setValue([...field.value.filter((exercise: any) => exercise.exercise !== name)]);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
