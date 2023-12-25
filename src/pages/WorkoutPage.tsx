import { add, format, setHours } from "date-fns";
import { useEffect, useState } from "react";
import { HiX, HiOutlineVolumeUp, HiOutlineVolumeOff } from "react-icons/hi";
import { Link } from "react-router-dom";

import { Workout } from "@/app-constants";
import { RealButton } from "@/components";
import { definedRoutes } from "@/routes";

export const WorkoutPage = () => {
  const workout: Workout = {
    id: "2",
    name: "Workout 2",
    averageCompletionTime: 50,
    duration: 3000,
    image: "11w.jpg",
    sequentialSets: true,
    exercises: [
      {
        exercise: "Explosive pull-ups",
        sets: 3,
        reps: 8,
        rest: 180,
        order: 1,
      },
      {
        exercise: "Front Lever pull-ups",
        sets: 5,
        reps: 8,
        rest: 180,
        order: 2,
      },
      {
        exercise: "Toes to bar",
        sets: 5,
        reps: 8,
        rest: 180,
        order: 2,
      },
      {
        exercise: "Face pulls with rings",
        sets: 5,
        reps: 10,
        rest: 120,
        order: 3,
      },
      {
        exercise: "HSPU",
        sets: 5,
        reps: 10,
        rest: 180,
        order: 4,
      },
      {
        exercise: "Pseudo planche push ups",
        sets: 5,
        reps: 8,
        rest: 260,
        order: 5,
      },
      {
        exercise: "Planche lean hold",
        sets: 5,
        reps: 0,
        duration: 15,
        rest: 180,
        order: 6,
      },
    ],
  };

  const formatTime = (totalSeconds: number, desiredFormat = "mm:ss") => {
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

  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0);
  const [totalWorkoutTimerActive, setTotalWorkoutTimerActive] = useState(false);

  const currentExercise = workout.exercises[currentExerciseIndex];
  const nextExercise = workout.exercises[currentExerciseIndex + 1] || workout.exercises[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isResting) {
      setRestCountdown(currentExercise.rest);
      interval = setInterval(() => {
        setRestCountdown(prev => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isResting]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (totalWorkoutTimerActive) {
      interval = setInterval(() => {
        setTotalWorkoutTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [totalWorkoutTimerActive]);

  // Start the total timer when the workout begins
  useEffect(() => {
    setTotalWorkoutTimerActive(true);
    return () => setTotalWorkoutTimerActive(false); // Stop the timer when the component unmounts
  }, []);

  const handleCompleteExercise = () => {
    if (currentSet < currentExercise.sets) {
      setIsResting(true);
      setCurrentSet(currentSet + 1);
      setTimeout(() => {
        setIsResting(false);
      }, currentExercise.rest * 1000);

      // go to next exercise
    } else {
      console.log("next exercise");

      if (currentExercise.rest) {
        setIsResting(true);
        setTimeout(() => setIsResting(false), currentExercise.rest * 1000);
      }
      const nextIndex = currentExerciseIndex + 1;
      if (nextIndex < workout.exercises.length) {
        setCurrentExerciseIndex(nextIndex);
        setCurrentSet(1);
      } else {
        setTotalWorkoutTimerActive(false);
        setIsWorkoutFinished(true);
      }
    }
  };

  if (isWorkoutFinished) {
    return (
      <div className="mt-40 text-center">
        <p className="text-2xl">Workout Complete</p>
        <p className="text-2xl">Time: {formatTime(totalWorkoutTime, "HH:mm:ss")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-between p-4">
        <Link to={definedRoutes.workoutsPage}>
          <HiX className="icon" />
        </Link>
        <p className="mx-auto text-xl font-semibold font-number">
          {formatTime(totalWorkoutTime, "HH:mm:ss")}
        </p>
        <div className="flex items-center space-x-2">
          {true ? <HiOutlineVolumeUp className="icon" /> : <HiOutlineVolumeOff className="icon" />}
        </div>
      </div>

      <div className="p-4">
        <div className="relative text-center">
          {!isResting && (
            <img
              alt="Exercise"
              className="w-full h-[200px] relative"
              src="/general/placeholder.svg"
              style={{
                aspectRatio: "355/200",
                objectFit: "cover",
              }}
            />
          )}

          {isResting && (
            <p className="mt-32 text-5xl font-bold font-number">{formatTime(restCountdown)}</p>
          )}
          {currentExercise.duration && (
            <div className="bg-white bg-opacity-70 absolute top-[5%] left-[2%] p-2 rounded-xl">
              <p className="z-10 text-3xl font-bold text-slate-800 font-number">
                {formatTime(currentExercise.duration)}
              </p>
            </div>
          )}
        </div>

        {!isResting && (
          <div className="mt-4 mb-2 text-center">
            {currentExercise.reps === 0 ? (
              <p className="text-2xl font-bold">{currentExercise.duration} seconds</p>
            ) : (
              <p className="text-2xl font-bold">{currentExercise.reps} reps</p>
            )}
            <p className="text-xl font-semibold">{currentExercise.exercise}</p>
            <p className="mt-5 text-3xl font-semibold">
              Set {currentSet + currentExercise.sets - currentExercise.sets}
            </p>
          </div>
        )}
      </div>

      <div className="p-4 mt-auto bg-slate-800">
        <p className="tracking-wide uppercase text-slate-100">next up</p>
        {currentSet < currentExercise.sets ? (
          <div className="flex items-center p-3">
            <img
              alt="Exercise"
              className="size-14"
              src="/general/placeholder.svg"
              style={{
                objectFit: "cover",
              }}
            />
            <div className="ml-4">
              <p className="text-lg font-semibold">{currentExercise.exercise}</p>
              <p className="text-sm text-gray-600">
                {isResting
                  ? `Next up set ${currentSet + 1}`
                  : `After this ${currentExercise.sets - currentSet} sets left`}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center p-3">
            <img
              alt="Exercise"
              className="size-14"
              src="/general/placeholder.svg"
              style={{
                objectFit: "cover",
              }}
            />
            <div className="ml-4">
              <p className="text-lg font-semibold">{nextExercise.exercise}</p>
              <p className="text-sm text-gray-600">{nextExercise.sets} sets</p>
            </div>
          </div>
        )}

        {isResting ? (
          <div className="flex flex-row justify-between mt-4">
            <RealButton
              className="px-2 w-14"
              variant="blue"
              onClick={() => setRestCountdown(prev => prev - 10)}
            >
              -10
            </RealButton>
            <RealButton variant="blue" onClick={() => setIsResting(false)}>
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
          <RealButton className="w-full mt-4" variant="blue" onClick={handleCompleteExercise}>
            {currentSet < currentExercise.sets ? "Complete set" : "Complete exercise"}
          </RealButton>
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
