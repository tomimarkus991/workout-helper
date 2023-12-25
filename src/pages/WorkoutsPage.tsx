import { Link } from "@tanstack/react-router";
import { FiPlusCircle } from "react-icons/fi";

import { Workout } from "@/app-constants";
import { NavbarBottom, RealButton, WorkoutCard } from "@/components";
import { useSession } from "@/hooks";

const workouts = () => {
  const _workouts: Workout[] = [];
  for (let i = 1; i <= 8; i++) {
    _workouts.push({
      id: `${i}`,
      name: `Workout ${i}`,
      averageCompletionTime: 30,
      duration: 3000,
      image: `${Math.floor(Math.random() * 11 + 1)}w.jpg`,
      sequentialSets: true,
      exercises: [
        { exercise: "Pullups", sets: 3, reps: 10, rest: 60, order: 1 },
        { exercise: "Pushups", sets: 3, reps: 10, rest: 60, order: 2 },
        { exercise: "Squats", sets: 3, reps: 10, rest: 60, order: 3 },
        { exercise: "Plank", sets: 3, reps: 0, duration: 120, rest: 60, order: 4 },
      ],
    });
  }
  // randomize the order of workouts
  _workouts.sort(() => Math.random() - 0.5);
  return _workouts;
};

export const WorkoutsPage = () => {
  const { data } = useSession();

  if (!data?.user) {
    return (
      <div className="flex flex-col items-center justify-center mt-40">
        <p className="mb-6 text-5xl font-bold">CaliWiz</p>
        <Link to="/login">
          <RealButton variant="blue1">Login</RealButton>
        </Link>
        <Link to="/register">
          <RealButton className="mt-4" variant="blue2">
            Register
          </RealButton>
        </Link>
      </div>
    );
  }
  return (
    <div className="mt-5 mb-24 max-w-md">
      {workouts().length !== 0 ? (
        <div className="mx-4">
          {workouts().map(workout => (
            <WorkoutCard
              key={workout.id}
              id={workout.id}
              name={workout.name}
              image={workout.image}
              averageCompletionTime={workout.averageCompletionTime}
            />
          ))}
          <Link to="/create-workout">
            <FiPlusCircle className="mx-auto mt-2 cursor-pointer icon size-14" />
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-40">
          <Link to="/create-workout">
            <FiPlusCircle className="cursor-pointer icon size-20" />
          </Link>
        </div>
      )}

      <NavbarBottom />
    </div>
  );
};
