/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import { Link, useParams } from "@tanstack/react-router";
import { HiArrowLeft } from "react-icons/hi";

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
      <div className="relative mb-40">
        <img
          src={`/workout/${workout?.image}`}
          className="absolute top-0 left-0 object-cover w-full h-40 aspect-auto rounded-xl"
          alt="workout-img"
        />
        <div className="absolute top-6 left-5 flex flex-row items-center w-[80%] ml-3">
          <div className="mr-4">
            <AnimationWrapper variants={animations.smallScale}>
              <Link
                to="/update-workout/$id"
                params={{
                  id,
                }}
              >
                <p className="text-2xl font-semibold underline">{workout?.workout_name}</p>
              </Link>
            </AnimationWrapper>
          </div>
          <Link className="ml-auto" to="/">
            <HiArrowLeft className="cursor-pointer size-7 fill-white hover:fill-gray-200" />
          </Link>
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
