interface Props {
  sets: number;
  reps: number;
  rest: number;
  duration: number;
  name: string;
}

export const ExerciseCard = ({ duration, reps, rest, sets, name }: Props) => {
  return (
    <div className="p-2 border border-blue-600 rounded-lg">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row">
          <p>{sets}x</p>
          <p>{reps === 0 && duration > 0 ? `${duration}s` : `${reps} reps`}</p>
          <p className="ml-1">{name}</p>
        </div>
        {rest < 60 ? <p>{rest} sec rest</p> : <p>{(Number(rest) / 60).toFixed(1)} min rest</p>}
      </div>
    </div>
  );
};
