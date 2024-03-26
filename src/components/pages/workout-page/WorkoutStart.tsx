/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HiX, HiOutlineVolumeUp, HiOutlineVolumeOff } from "react-icons/hi";

import { useGetWorkout, useCreateWorkoutStatistic } from "../../../hooks";
import { initSounds, playSound, setVolume, stopSound } from "../../../services/sound";
import { formatTime } from "../../../utils/formatTime";
import { RealButton } from "../../button";

interface Props {
  isWorkingOut: boolean;
  setIsWorkingOut: (isWorkingOut: boolean) => void;
}

initSounds();
setVolume();

export const WorkoutStart = ({ isWorkingOut, setIsWorkingOut }: Props) => {
  const { id } = useParams({ strict: false });

  const { data: workout, isLoading, error } = useGetWorkout(id);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const { mutate: createWorkoutStatistic } = useCreateWorkoutStatistic();

  const navigate = useNavigate();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isWorkoutFinished, setIsWorkoutFinished] = useState(false);

  // this counts down rest periods
  const [restCountdown, setRestCountdown] = useState(0);
  const [exerciseCountdown, setExerciseCountdown] = useState(0);
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0);

  const currentExercise = workout?.modifiedExercises[currentExerciseIndex]!;
  const nextExercise = workout?.modifiedExercises[currentExerciseIndex + 1];

  useEffect(() => {
    let interval: any;

    if (isResting) {
      setRestCountdown(currentExercise.rest);

      interval = setInterval(() => {
        setRestCountdown(countdown => {
          if (countdown > 1) {
            if (countdown === 6 && isAudioEnabled) playSound("ending");
            return countdown - 1;
          }

          if (countdown === 1 && isAudioEnabled) playSound("complete");
          setIsResting(false);
          clearInterval(interval);
          return 0;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isResting, isAudioEnabled]);

  const handleCompleteExercise = () => {
    const nextIndex = currentExerciseIndex + 1;
    if (nextIndex < workout!.modifiedExercises.length) {
      setCurrentExerciseIndex(nextIndex);
    }
    // when switching to next exercise, start rest countdown
    setRestCountdown(currentExercise?.rest || 0);
    setIsResting(true);
  };

  useEffect(() => {
    let interval: any;

    if (currentExercise?.duration !== 0 && !isResting) {
      setExerciseCountdown(currentExercise?.duration || 0);

      interval = setInterval(() => {
        setExerciseCountdown(countdown => {
          if (countdown > 1) {
            if (countdown === 6 && isAudioEnabled) playSound("ending");
            return countdown - 1;
          }

          if (countdown === 1 && isAudioEnabled) playSound("complete");
          if (workout?.complete_duration_exercise_on_end) {
            handleCompleteExercise();
          }
          return 0;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [currentExercise?.duration, isResting, isAudioEnabled]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isWorkingOut && !isWorkoutFinished) {
      interval = setInterval(() => {
        setTotalWorkoutTime(prev => prev + 1);
      }, 1000);
    }

    if (isWorkoutFinished) {
      createWorkoutStatistic({
        workout_id: workout?.id || "",
        completion_time: totalWorkoutTime,
      });

      stopSound("ending");
    }

    return () => clearInterval(interval);
  }, [isWorkingOut, isWorkoutFinished]);

  if (error?.message) {
    navigate({ to: "/" });
  }

  if (isLoading && !workout && !currentExercise) {
    return <p>Loading...</p>;
  }

  if (isWorkoutFinished) {
    return (
      <div className="mt-40 text-center">
        <p className="text-2xl">Workout Complete</p>
        <p className="my-6 text-2xl">Time: {formatTime(totalWorkoutTime, "HH:mm:ss")}</p>
        <RealButton variant="blue" onClick={() => setIsWorkingOut(false)}>
          Back
        </RealButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-md min-h-screen mx-auto sm:max-w-3xl">
      <div className="flex items-center justify-between p-4">
        <Link to="/">
          <HiX className="icon" />
        </Link>
        <p className="mx-auto text-2xl font-semibold font-number">
          {formatTime(totalWorkoutTime, "HH:mm:ss")}
        </p>
        <div className="flex items-center space-x-2">
          {isAudioEnabled ? (
            <HiOutlineVolumeUp onClick={() => setIsAudioEnabled(false)} className="icon" />
          ) : (
            <HiOutlineVolumeOff onClick={() => setIsAudioEnabled(true)} className="icon" />
          )}
        </div>
      </div>

      <div className="flex flex-col flex-grow sm:flex-grow-0 sm:flex-row sm:justify-evenly">
        <div className="p-4">
          <div className="relative mt-32 text-center sm:mt-14">
            {isResting && (
              <div>
                <p className="mt-32 text-5xl font-semibold">Resting</p>
                <p className="mt-6 text-6xl font-bold font-number">{formatTime(restCountdown)}</p>
              </div>
            )}
            {currentExercise.duration !== 0 && !isResting && (
              <p className="z-10 mt-6 text-4xl font-bold font-number">
                {formatTime(exerciseCountdown)}
              </p>
            )}
          </div>

          {!isResting && (
            <div className="mt-4 mb-2 text-center sm:text-center">
              {currentExercise.reps !== 0 && (
                <p className="text-3xl font-bold">
                  {currentExercise.reps === 999 ? "Max" : currentExercise.reps} reps
                </p>
              )}
              <p className="max-w-xs mx-auto mt-4 text-3xl font-semibold sm:max-w-none sm:mx-auto">
                {currentExercise.exercise_name}
              </p>
              <p className="mt-5 text-3xl font-semibold">Set {currentExercise.sets}</p>
            </div>
          )}
        </div>

        {!nextExercise && !isResting ? (
          <>
            <div className="p-4 mt-auto bg-slate-800">
              <p className="text-2xl font-semibold text-center">Last set</p>

              <RealButton
                className="w-full mt-6 mb-4"
                variant="blue"
                onClick={() => {
                  setIsWorkoutFinished(true);

                  if (isAudioEnabled) stopSound("complete");
                }}
              >
                Complete workout
              </RealButton>
            </div>
          </>
        ) : (
          <div className="p-4 mt-auto overflow-x-scroll bg-slate-800 sm:rounded-xl">
            <p className="mb-1 ml-4 text-xl tracking-wide uppercase text-slate-100">next up</p>
            <div className="flex items-center">
              <div className="ml-4">
                {isResting ? (
                  <>
                    <p className="text-2xl font-semibold">{currentExercise?.exercise_name}</p>
                    {workout?.sequential_sets ? (
                      <div className="flex flex-row space-x-6">
                        <p className="text-xl text-gray-100">Set {currentExercise?.sets}</p>
                        <p className="text-xl text-gray-100">
                          {currentExercise?.reps !== 0
                            ? `${
                                currentExercise?.reps === 999 ? "Max" : currentExercise?.reps
                              } reps`
                            : `${currentExercise.duration}s`}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xl text-gray-100">
                        {currentExercise?.reps !== 0
                          ? `${currentExercise?.reps === 999 ? "Max" : currentExercise?.reps} reps`
                          : `${currentExercise.duration}s`}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="mb-3 text-2xl font-semibold">{nextExercise?.exercise_name}</p>
                    {workout?.sequential_sets ? (
                      <div className="flex flex-row space-x-6">
                        <p className="text-xl text-gray-100">Set {nextExercise?.sets}</p>
                        <p className="text-xl text-gray-100">
                          {nextExercise?.reps !== 0
                            ? `${nextExercise?.reps === 999 ? "Max" : nextExercise?.reps} reps`
                            : `${nextExercise?.duration}s`}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xl text-gray-100">
                        {nextExercise?.reps !== 0
                          ? `${nextExercise?.reps === 999 ? "Max" : nextExercise?.reps} reps`
                          : `${nextExercise.duration}s`}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-row justify-between mt-4">
              {(currentExercise.reps === 0 || isResting) && (
                <RealButton
                  className="w-0"
                  size="lg"
                  variant="blue"
                  onClick={() => {
                    if (isResting) {
                      setRestCountdown(prev => Math.max(prev - 10, 0));
                    } else {
                      setExerciseCountdown(prev => Math.max(prev - 10, 0));
                    }
                  }}
                >
                  -10
                </RealButton>
              )}
              <RealButton
                className="mx-auto"
                size="lg"
                variant="blue"
                onClick={() => {
                  if (isResting) {
                    setIsResting(false);
                  } else {
                    handleCompleteExercise();
                  }
                }}
              >
                {isResting ? "Skip rest" : "Complete"}
              </RealButton>
              {(currentExercise.reps === 0 || isResting) && (
                <RealButton
                  className="w-0"
                  size="lg"
                  variant="blue"
                  onClick={() => {
                    if (isResting) {
                      setRestCountdown(prev => prev + 10);
                    } else {
                      setExerciseCountdown(prev => prev + 10);
                    }
                  }}
                >
                  +10
                </RealButton>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
