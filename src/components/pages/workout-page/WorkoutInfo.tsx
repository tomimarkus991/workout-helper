/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import { Link, useParams } from "@tanstack/react-router";
import { HiArrowLeft, HiPencil } from "react-icons/hi";

import { useGetWorkout } from "../../../hooks";
import { AnimationWrapper, animations } from "../../animations";
import { RealButton } from "../../button";
import { ExerciseCard } from "../../cards";

interface Props {
  isWorkingOut: boolean;
  setIsWorkingOut: (isWorkingOut: boolean) => void;
}

export const WorkoutInfo = ({ isWorkingOut, setIsWorkingOut }: Props) => {
  const { id } = useParams({ strict: false });

  const { data: workout } = useGetWorkout(id);

  return (
    <div className="flex flex-col max-w-md min-h-screen p-4 m-auto">
      <div className="flex flex-row items-center ml-3 mr-6">
        <Link to="/">
          <HiArrowLeft className="mr-4 cursor-pointer size-7 fill-white hover:fill-gray-200" />
        </Link>
        <p className="text-3xl font-semibold text-center">{workout?.workout_name}</p>

        <div className="ml-auto">
          <AnimationWrapper variants={animations.smallScale}>
            <Link
              to="/update-workout/$id"
              params={{
                id,
              }}
            >
              <HiPencil className="cursor-pointer size-7 fill-white hover:fill-gray-200" />
            </Link>
          </AnimationWrapper>
        </div>
      </div>
      <div>
        <p className="mt-6 mb-3 text-2xl font-semibold">Exercises</p>
        <div className="space-y-2">
          {workout?.exercise.map(exercise => {
            return (
              <ExerciseCard
                key={exercise.id}
                duration={exercise.duration}
                sets={exercise.sets}
                reps={exercise.reps}
                rest={exercise.rest}
                name={exercise.exercise_name}
              />
            );
          })}
        </div>
      </div>
      <div className="mx-auto mt-auto">
        <RealButton
          className="mt-4"
          variant="blue"
          size="lg"
          onClick={() => setIsWorkingOut(!isWorkingOut)}
        >
          Start workout
        </RealButton>
      </div>
    </div>
  );
};
