import { FiPlusCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

import { NavbarBottom, WorkoutCard } from "@/components";

type Workout = {
  id: string;
  name: string;
  averageCompletionTime: number;
  imageUrl?: string;
};

const workouts = () => {
  const _workouts: Workout[] = [];
  for (let i = 0; i < 0; i++) {
    _workouts.push({
      id: `${i}`,
      name: `Workout ${i}`,
      averageCompletionTime: 30,
      imageUrl: `${i}w.jpg`,
    });
  }
  // randomize the order of workouts
  _workouts.sort(() => Math.random() - 0.5);
  return _workouts;
};

export const WorkoutsPage = () => (
  <div className="mt-5 mb-24">
    {workouts().length !== 0 ? (
      <div className="mx-4 space-y-4">
        {workouts().map(workout => (
          <WorkoutCard {...workout} />
        ))}
      </div>
    ) : (
      <div className="flex items-center justify-center mt-40">
        <Link to="/create-workout">
          <FiPlusCircle className="text-gray-800 cursor-pointer size-16" />
        </Link>
      </div>
    )}

    <NavbarBottom />
  </div>
);
