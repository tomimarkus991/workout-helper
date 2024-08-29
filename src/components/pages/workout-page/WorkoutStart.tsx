/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { IonSpinner } from "@ionic/react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HiX, HiOutlineVolumeUp, HiOutlineVolumeOff } from "react-icons/hi";

import { useGetWorkout, useCreateWorkoutStatistic, useUser } from "../../../hooks";
import { cn } from "../../../lib";
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
  const { data: user } = useUser();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const { mutateAsync: createWorkoutStatistic, isPending } = useCreateWorkoutStatistic();

  const navigate = useNavigate();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isWorkoutFinished, setIsWorkoutFinished] = useState(false);

  // this counts down rest periods
  const [restCountdown, setRestCountdown] = useState(0);

  const [exerciseCountdown, setExerciseCountdown] = useState(0);
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0);

  const [startCountdown, setStartCountdown] = useState(4);

  const previousExercise = workout?.modifiedExercises[currentExerciseIndex - 1];
  const currentExercise = workout?.modifiedExercises[currentExerciseIndex];
  const nextExercise = workout?.modifiedExercises[currentExerciseIndex + 1];

  useEffect(() => {
    let interval: any;

    if (startCountdown > 0) {
      interval = setInterval(() => {
        setStartCountdown(prev => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [startCountdown]);

  useEffect(() => {
    let interval: any;

    if (isResting) {
      setRestCountdown(previousExercise?.rest || 0);

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
    setRestCountdown(nextExercise?.rest || 0);
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

          if (workout?.complete_duration_exercise_on_end && nextExercise) {
            handleCompleteExercise();
          }

          if (!nextExercise) {
            setIsWorkoutFinished(true);
          }
          return 0;
        });
      }, 1000);
    } else {
      return () => clearInterval(interval);
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
      stopSound("ending");
      // @ts-ignore
      clearInterval(interval);

      createWorkoutStatistic({
        workout_id: workout?.id || "",
        completion_time: totalWorkoutTime,
      });
    }

    return () => clearInterval(interval);
  }, [isWorkingOut, isWorkoutFinished]);

  if (startCountdown > 0) {
    return (
      <div className="text-6xl text-center mt-72">
        {startCountdown === 1 ? <p>GO!</p> : <p>{startCountdown - 1}</p>}
      </div>
    );
  }

  if (error?.message) {
    navigate({ to: "/" });
  }

  if (isLoading && !workout && !currentExercise) {
    return <p>Loading...</p>;
  }

  if (isWorkoutFinished && !isPending) {
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
            {currentExercise?.duration !== 0 && !isResting && (
              <p className="z-10 mt-6 text-6xl font-bold font-number">
                {formatTime(exerciseCountdown)}
              </p>
            )}
          </div>

          {!isResting && (
            <div className="mt-4 mb-2 text-center sm:text-center">
              {currentExercise?.reps !== 0 && (
                <p className={cn("font-bold", user?.bigger_text ? "text-5xl" : "text-4xl")}>
                  {currentExercise?.reps === 999 ? "Max" : currentExercise?.reps} reps
                </p>
              )}
              <p
                className={cn(
                  "max-w-xs mx-auto mt-4 font-semibold sm:max-w-none sm:mx-auto",
                  user?.bigger_text ? "text-5xl" : "text-4xl",
                )}
              >
                {currentExercise?.exercise_name}
              </p>
              <p className={cn("mt-5 font-semibold", user?.bigger_text ? "text-5xl" : "text-4xl")}>
                Set {currentExercise?.sets}
              </p>
            </div>
          )}
        </div>

        {!nextExercise && !isResting && exerciseCountdown === 0 ? (
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
                {isPending ? <IonSpinner /> : "Finish workout"}
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
                    <p className={cn(user?.bigger_text ? "text-4xl" : "text-2xl", "font-semibold")}>
                      {currentExercise?.exercise_name}
                    </p>
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
                    {nextExercise ? (
                      <>
                        <p
                          className={cn(
                            user?.bigger_text ? "text-4xl" : "text-2xl",
                            "font-semibold",
                          )}
                        >
                          {nextExercise?.exercise_name}
                        </p>
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
                    ) : (
                      <p className="text-xl text-gray-100">Finish workout</p>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-row justify-between mt-4">
              {(currentExercise?.reps === 0 || isResting) && (
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
              {(currentExercise?.reps === 0 || isResting) && (
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
