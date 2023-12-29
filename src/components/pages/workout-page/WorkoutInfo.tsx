/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Link, useParams } from "@tanstack/react-router";
import { BsThreeDots } from "react-icons/bs";
import { HiArrowLeft } from "react-icons/hi";

import {
  AnimationWrapper,
  ExerciseCard,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RealButton,
  animations,
} from "@/components";
import { useDeleteWorkout, useGetWorkout } from "@/hooks";

interface Props {
  isWorkingOut: boolean;
  setIsWorkingOut: (isWorkingOut: boolean) => void;
}

export const WorkoutInfo = ({ isWorkingOut, setIsWorkingOut }: Props) => {
  const { id } = useParams({ strict: false });

  const { data: workout } = useGetWorkout(id);
  const { mutate: deleteWorkout } = useDeleteWorkout();
  return (
    <div className="flex flex-col max-w-md min-h-screen p-4 m-auto">
      <div className="flex flex-row items-center ml-3 mr-6">
        <Link to="/">
          <HiArrowLeft className="mr-4 cursor-pointer size-7 fill-white hover:fill-gray-200" />
        </Link>
        <p className="text-3xl font-semibold text-center">{workout?.workout_name}</p>

        <div className="ml-auto">
          <Popover>
            <PopoverTrigger>
              <AnimationWrapper variants={animations.smallScale}>
                <BsThreeDots className="cursor-pointer size-7 fill-white hover:fill-gray-200" />
              </AnimationWrapper>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col items-center space-y-1">
                <p onClick={() => deleteWorkout({ id })}>delete</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div>
        <p className="mt-6 text-2xl font-semibold">Exercises</p>
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
      <RealButton className="mt-auto" variant="blue" onClick={() => setIsWorkingOut(!isWorkingOut)}>
        Start workout
      </RealButton>
    </div>
  );
};
