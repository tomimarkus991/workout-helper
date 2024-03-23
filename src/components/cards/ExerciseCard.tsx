import { secondsToMinutes } from "date-fns";

interface Props {
  sets: number;
  reps: number | string;
  rest: number;
  duration: number;
  name: string;
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
        {rest < 60 ? <p>{rest}s rest</p> : <p>{secondsToMinutes(rest)}m rest</p>}
      </div>
    </div>
  );
};
