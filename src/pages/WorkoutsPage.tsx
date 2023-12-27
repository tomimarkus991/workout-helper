import { Link } from "@tanstack/react-router";
import { FiPlusCircle } from "react-icons/fi";

import { NavbarBottom, RealButton, WorkoutCard } from "@/components";
import { useUser, useGetWorkouts } from "@/hooks";

export const WorkoutsPage = () => {
  const { data: user } = useUser();
  const { data: workouts, isLoading } = useGetWorkouts();

  if (!workouts && isLoading) {
    return <p></p>;
  }

  if (!user) {
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
  if (!workouts || workouts.length === 0) {
    return (
      <div className="flex items-center justify-center mt-40">
        <Link to="/create-workout">
          <FiPlusCircle className="cursor-pointer icon size-20" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mt-5 mb-24">
      <div className="mx-4">
        {workouts?.map(workout => (
          <WorkoutCard
            key={workout.id}
            id={workout.id}
            name={workout.workout_name}
            image={workout.image}
            averageCompletionTime={workout.average_completion_time}
          />
        ))}
        <Link to="/create-workout">
          <FiPlusCircle className="mx-auto mt-2 cursor-pointer icon size-14" />
        </Link>
      </div>

      <NavbarBottom />
    </div>
  );
};
