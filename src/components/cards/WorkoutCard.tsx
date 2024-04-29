import { Link } from "@tanstack/react-router";

import { Workout } from "../../app-constants";

type Props = Pick<Workout, "id" | "name" | "image"> & { averageCompletionTime: string };

export const WorkoutCard = ({ id, averageCompletionTime, name, image }: Props) => (
  <Link
    to="/workout/$id"
    params={{
      id,
    }}
  >
    <div className="relative w-full h-40 mt-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
      <img
        src={`/workout/${image}`}
        className="object-cover w-full h-full aspect-auto rounded-xl"
        alt="workout-img"
      />
      <div className="absolute px-4 py-2 bg-white rounded top-4 left-4 bg-opacity-70">
        <p className="text-xl font-bold text-slate-800">{name}</p>
      </div>
      <div className="absolute px-4 py-2 bg-white rounded bottom-4 left-4 bg-opacity-70">
        <p className="text-lg font-medium text-slate-800">{averageCompletionTime}</p>
      </div>
    </div>
  </Link>
);
