/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { add, format, setHours } from "date-fns";
import { useEffect, useState } from "react";
import { HiX, HiOutlineVolumeUp, HiOutlineVolumeOff } from "react-icons/hi";

import { useGetWorkout, useCreateWorkoutStatistic } from "../../../hooks";
import { initSounds, playSound, setVolume, stopSound } from "../../../services/sound";
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

  const formatTime = (totalSeconds: number, desiredFormat = "mm:ss") => {
    if (totalSeconds <= 0) {
      return "00:00";
    }
    const baseDate = setHours(new Date(), 0).setMinutes(0, 0, 0);
    const date = add(baseDate, { seconds: totalSeconds });

    return format(date, desiredFormat);
  };

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [isWorkoutFinished, setIsWorkoutFinished] = useState(false);

  // this counts down rest periods
  const [restCountdown, setRestCountdown] = useState(0);
  const [exerciseCountdown, setExerciseCountdown] = useState(0);
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0);

  const currentExercise = workout?.exercise[currentExerciseIndex]!;
  const nextExercise = workout?.exercise[currentExerciseIndex + 1];

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
    if (currentSet < currentExercise.sets) {
      setCurrentSet(currentSet + 1);

      setRestCountdown(currentExercise?.rest || 0);
      setIsResting(true);
      // else (when the last set ends): go to next exercise
    } else {
      const nextIndex = currentExerciseIndex + 1;
      if (nextIndex < workout!.exercise.length) {
        setCurrentExerciseIndex(nextIndex);
        setCurrentSet(1);
      }
      // when switching to next exercise, start rest countdown
      setRestCountdown(currentExercise?.rest || 0);
      setIsResting(true);
    }
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
          clearInterval(interval);
          return 0;
        });
      }, 1000);
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
    <div className="flex flex-col max-w-md min-h-screen mx-auto md:max-w-2xl">
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

      <div className="flex flex-col flex-grow md:flex-grow-0 md:flex-row md:justify-evenly">
        <div className="p-4">
          <div className="relative mt-32 text-center md:mt-14">
            {/* {!isResting && (
            <img
              alt="Exercise"
              className="w-full h-[200px] relative"
              src="/general/placeholder.svg"
              style={{
                aspectRatio: "355/200",
                objectFit: "cover",
              }}
            />
          )} */}

            {isResting && (
              <p className="mt-32 text-5xl font-bold font-number">{formatTime(restCountdown)}</p>
            )}
            {currentExercise.duration !== 0 && !isResting && (
              <p className="z-10 mt-6 text-3xl font-bold font-number">
                {formatTime(exerciseCountdown)}
              </p>
            )}
          </div>

          {!isResting && (
            <div className="mt-4 mb-2 text-center md:text-center">
              {currentExercise.reps !== 0 && (
                <p className="text-2xl font-bold">{currentExercise.reps} reps</p>
              )}
              <p className="max-w-xs mx-auto mt-4 text-2xl font-semibold md:max-w-none md:mx-auto">
                {currentExercise.exercise_name}
              </p>
              <p className="mt-5 text-3xl font-semibold">
                Set {currentSet + currentExercise.sets - currentExercise.sets}
              </p>
            </div>
          )}
        </div>

        {!nextExercise && currentExercise.sets === currentSet && !isResting ? (
          <>
            <div className="p-4 mt-auto bg-slate-800">
              <p className="text-2xl font-semibold text-center">Last set</p>

              <RealButton
                className="w-full mt-6 mb-4"
                variant="blue"
                onClick={() => {
                  setIsWorkoutFinished(true);

                  createWorkoutStatistic({
                    workout_id: workout?.id || "",
                    completion_time: totalWorkoutTime,
                  });

                  if (isAudioEnabled) stopSound("complete");
                }}
              >
                Complete workout
              </RealButton>
            </div>
          </>
        ) : (
          <div className="p-4 mt-auto bg-slate-800 md:rounded-xl">
            <p className="tracking-wide uppercase ml-7 text-slate-100">next up</p>
            {currentSet < currentExercise.sets ? (
              <div className="flex items-center p-3">
                {/* <img
                alt="Exercise"
                className="size-14"
                src="/general/placeholder.svg"
                style={{
                  objectFit: "cover",
                }}
              /> */}
                <div className="ml-4">
                  <p className="text-lg font-semibold">{currentExercise.exercise_name}</p>
                  <p className="text-sm text-gray-600">
                    {isResting
                      ? `Next up set ${currentSet}`
                      : `After this ${currentExercise.sets - currentSet} sets left`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center p-3">
                {/* <img
                alt="Exercise"
                className="size-14"
                src="/general/placeholder.svg"
                style={{
                  objectFit: "cover",
                }}
              /> */}
                <div className="ml-4">
                  {isResting ? (
                    <>
                      <p className="text-lg font-semibold">{currentExercise?.exercise_name}</p>
                      <p className="text-sm text-gray-600">Last set</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-semibold">{nextExercise?.exercise_name}</p>
                      <p className="text-sm text-gray-600">{nextExercise?.sets} sets</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {isResting ? (
              <div className="flex flex-row justify-between mt-4">
                <RealButton
                  className="px-2 w-14"
                  variant="blue"
                  onClick={() => setRestCountdown(prev => Math.max(prev - 10, 0))}
                >
                  -10
                </RealButton>
                <RealButton className="mx-4" variant="blue" onClick={() => setIsResting(false)}>
                  Skip rest
                </RealButton>
                <RealButton
                  className="px-2 w-14"
                  variant="blue"
                  onClick={() => setRestCountdown(prev => prev + 10)}
                >
                  +10
                </RealButton>
              </div>
            ) : (
              <>
                {currentExercise.duration !== 0 ? (
                  <div className="flex flex-row justify-between mt-4">
                    <RealButton
                      className="w-12 px-2"
                      variant="blue"
                      onClick={() => setExerciseCountdown(prev => Math.max(prev - 10, 0))}
                    >
                      -10
                    </RealButton>
                    <RealButton variant="blue" className="mx-4" onClick={handleCompleteExercise}>
                      {currentSet < currentExercise.sets ? "Complete set" : "Complete"}
                    </RealButton>
                    <RealButton
                      className="w-12 px-2"
                      variant="blue"
                      onClick={() => setExerciseCountdown(prev => prev + 10)}
                    >
                      +10
                    </RealButton>
                  </div>
                ) : (
                  <RealButton
                    className="w-full mt-4"
                    variant="blue"
                    onClick={handleCompleteExercise}
                  >
                    {currentSet < currentExercise.sets ? "Complete set" : "Complete"}
                  </RealButton>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
// useEffect(() => {
//   // when sequentialSets do nothing

//   if (workout.sequentialSets === false) {
//     // destructure the array based on sets
//     // so if pullups 3, pushups 2, squats 3, plank 1
//     // then array should be [pullups,pushups,squats,plank, pullups pushups,squats, pulluups,squats, pullups, squats]

//     // for (const exercise of workout.exercises) {
//     // }
//     // count exercise sets
//     // const maxSets = Math.max(...workout.exercises.map(e => e.sets));

//     let totalSets = 0;
//     for (const exercise of workout.exercises) {
//       totalSets += exercise.sets;
//     }
//     totalSets = 9;

//     console.log("totalsets", totalSets);

//     for (let i = 0; i < totalSets; i++) {
//       workout.exercises.forEach(exercise => {
//         let currentExerciseIndex = 0;
//         if (workout.exercises[currentExerciseIndex].sets > 0) {
//           workout.exercises[currentExerciseIndex].sets--;
//           setExerciseState(prev => [...prev, { ...exercise, sets: 1, order: prev.length + 1 }]);
//         } else {
//           currentExerciseIndex++;
//         }
//         currentExerciseIndex++;
//       });
//     }
//   }
// }, []);
