import { Link, useParams } from "@tanstack/react-router";
import { Form, Formik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { HiArrowLeft } from "react-icons/hi";
import { IoArchive } from "react-icons/io5";
import { v4 as genUuid } from "uuid";

import { CreateWorkoutFormValues, ExerciseFormValues, YupSchemas } from "../../app-constants";
import { useArchiveWorkout, useCreateExercise, useGetWorkout } from "../../hooks";
import { useUpdateExercise } from "../../hooks/mutations/useUpdateExercise";
import { useUpdateWorkout } from "../../hooks/mutations/useUpdateWorkout";
import { cn } from "../../lib";
import { animations, AnimationWrapper } from "../animations";
import { RealButton } from "../button";
import { FormikExerciseCard } from "../cards";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "../Popover";

import { FormikInput } from "./FormikInput";
import { FormikToggle } from "./FormikToggle";

export const WorkoutEditor = () => {
  const { id } = useParams({ strict: false });

  const { data: workout } = useGetWorkout(id);

  if (!workout) {
    return <p>Workout not found</p>;
  }

  const { mutate: archiveWorkout } = useArchiveWorkout();

  const { mutateAsync: updateWorkout } = useUpdateWorkout();
  const { mutateAsync: createExercise } = useCreateExercise();
  const { mutateAsync: updateExercise } = useUpdateExercise();

  const [isEditingExercise, setIsEditingExercise] = useState(false);
  const [isUpdatingWorkout, setIsUpdatingWorkout] = useState(false);
  const [wasSomethingDeletedOrMoved, setWasSomethingDeletedOrMoved] = useState(false);

  const [initialValues] = useState<CreateWorkoutFormValues & ExerciseFormValues>({
    name: workout.workout_name,
    completeDurationExerciseOnEnd: workout.complete_duration_exercise_on_end,
    sequentialSets: workout.sequential_sets,
    exercises: workout.exercise.map(exercise => ({
      exerciseId: exercise.id,
      exercise: exercise.exercise_name,
      sets: exercise.sets,
      reps: exercise.reps,
      rest: exercise.rest,
      duration: exercise.duration,
      order: exercise.order,
      clearSets: false,
      clearRest: false,
      clearReps: false,
      clearDuration: false,
    })),
    exerciseId: "",
    exercise: "",
    sets: "" as unknown as number,
    reps: "" as unknown as number,
    rest: "" as unknown as number,
    order: "" as unknown as number,
    duration: "" as unknown as number,
    clearSets: false,
    clearRest: false,
    clearReps: false,
    clearDuration: false,
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={isUpdatingWorkout ? YupSchemas.CreateWorkout : YupSchemas.CreateExercise}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values, { setSubmitting, setFieldValue }) => {
        setSubmitting(true);

        if (isUpdatingWorkout) {
          const { sequentialSets, completeDurationExerciseOnEnd, exercises, name } = values;

          if (!sequentialSets) {
            const firstExerciseSets = exercises[0].sets;

            for (const exercise of exercises) {
              if (exercise.sets !== firstExerciseSets) {
                toast.error(
                  "All exercises must have the same number of sets, when not sequential.",
                );
                return;
              }
            }
          }

          await updateWorkout({
            id,
            workout_name: name,
            sequential_sets: sequentialSets,
            complete_duration_exercise_on_end:
              completeDurationExerciseOnEnd || workout?.complete_duration_exercise_on_end,
          });

          if (wasSomethingDeletedOrMoved) {
            for await (const [index, exercise] of exercises.entries()) {
              await updateExercise({
                id: exercise.exerciseId,
                order: index + 1,
              });
            }
          }
        } else {
          const {
            clearDuration,
            clearReps,
            clearRest,
            clearSets,
            reps,
            rest,
            duration,
            sets,
            exercise,
            exerciseId,
          } = values;

          if (isEditingExercise) {
            await updateExercise({
              id: exerciseId,
              exercise_name: exercise,
              reps: typeof reps === "string" ? 0 : reps,
              sets,
              rest: typeof rest === "string" ? 0 : rest,
              duration: typeof duration === "string" ? 0 : duration,
            });

            const exerciseIndex = values.exercises.findIndex(
              __exercise => __exercise.exerciseId === exerciseId,
            );

            const updatedExercises = [...values.exercises];
            updatedExercises[exerciseIndex] = {
              exercise,
              reps,
              duration,
              rest,
              order: values.exercises[exerciseIndex].order,
              sets,
              exerciseId,
              clearSets: false,
              clearRest: false,
              clearReps: false,
              clearDuration: false,
            };

            setFieldValue("exercises", updatedExercises);

            setFieldValue("exercise", "");
            setFieldValue("sets", "");
            setFieldValue("reps", "");
            setFieldValue("rest", "");
            setFieldValue("duration", "");
          } else {
            if (values.exercises.some(__exercise => __exercise.exercise === exercise)) {
              toast.error("Exercise name has to be unique");
              return;
            }

            const _exerciseId = genUuid();

            setFieldValue("exerciseId", _exerciseId);

            await createExercise({
              id: _exerciseId,
              exercise_name: exercise,
              order: values.exercises.length + 1,
              reps: typeof reps === "string" ? 0 : reps,
              sets,
              rest: typeof rest === "string" ? 0 : rest,
              duration: typeof duration === "string" ? 0 : duration,
              workout_id: id,
            });

            setFieldValue("exercises", [
              ...values.exercises,
              { exercise, reps, duration, rest, sets, exerciseId: _exerciseId },
            ]);
          }

          setFieldValue("exercise", "");

          if (clearSets) {
            setFieldValue("sets", "");
          }
          if (clearRest) {
            setFieldValue("rest", "");
          }
          if (clearReps) {
            setFieldValue("reps", "");
          }
          if (clearDuration) {
            setFieldValue("duration", "");
          }
        }

        setSubmitting(false);
      }}
    >
      {({ isValid, handleSubmit, values }) => {
        return (
          <Form className={cn("max-w-md mx-auto min-h-screen p-2 flex flex-col")}>
            <div className="flex flex-row items-center justify-between mx-3 my-5">
              <Popover>
                <PopoverTrigger className="relative">
                  <IoArchive className="text-gray-400 size-8 icon" />
                </PopoverTrigger>
                <PopoverContent className="z-50 p-4 mt-5">
                  <div className="flex flex-col">
                    <div className="flex flex-row mb-4 max-w-[11rem]">
                      <p className="text-sm font-semibold text-center">
                        Are you sure you want to archive this workout?
                      </p>
                    </div>
                    <div className="flex flex-row items-center justify-center">
                      <RealButton
                        className="px-3 ml-4"
                        variant="red"
                        onClick={() => archiveWorkout({ id })}
                      >
                        Archive
                      </RealButton>

                      <PopoverClose>
                        <AnimationWrapper
                          className="self-center ml-4 cursor-pointer"
                          variants={animations.smallScaleXs}
                        >
                          <RealButton className="px-3 ml-4" variant="blue">
                            Cancel
                          </RealButton>
                        </AnimationWrapper>
                      </PopoverClose>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <p className="text-2xl font-semibold text-center">Update Workout</p>
              <Link to="/">
                <HiArrowLeft className="icon" />
              </Link>
            </div>
            <div className="mb-5">
              <FormikInput name="name" placeholder="L-Sit" label="Workout name" />
              <FormikToggle name="sequentialSets" label="Finish one exercise's sets first" />
              <FormikToggle
                name="completeDurationExerciseOnEnd"
                label="Start rest immediately after exercise duration ends"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <div className="space-y-2">
                {values.exercises?.map((exercise, index) => {
                  return (
                    <FormikExerciseCard
                      key={exercise.exerciseId}
                      duration={exercise.duration}
                      sets={exercise.sets}
                      reps={exercise.reps}
                      rest={exercise.rest}
                      name={exercise.exercise}
                      setIsEditingExercise={setIsEditingExercise}
                      workoutId={id}
                      exerciseId={exercise.exerciseId}
                      index={index}
                      setWasSomethingDeletedOrMoved={setWasSomethingDeletedOrMoved}
                    />
                  );
                })}
              </div>
              <FormikInput name="exercise" placeholder="Scapula shrugs" label="Exercise name" />
              <div className="flex flex-row justify-between mt-1 mb-2">
                <div className="flex flex-row items-center justify-center space-x-2">
                  <FormikInput
                    className="w-20"
                    type="number"
                    name="sets"
                    placeholder="3"
                    label="Sets"
                  />
                  <FormikToggle name="clearSets" label="Clear sets" />
                </div>
                <div className="flex flex-row items-center justify-center space-x-2">
                  <FormikInput
                    className="w-20"
                    type="number"
                    name="rest"
                    placeholder="180"
                    label="Rest (sec)"
                  />
                  <FormikToggle name="clearRest" label="Clear rest" />
                </div>
              </div>

              <div className="flex flex-row justify-between mt-1 mb-2">
                <div className="flex flex-row items-center justify-center space-x-2">
                  <FormikInput
                    className="w-20"
                    type="number"
                    name="reps"
                    placeholder="10"
                    label="Reps"
                  />
                  <FormikToggle name="clearReps" label="Clear reps" />
                </div>
                <span className="mt-8">or</span>
                <div className="flex flex-row items-center justify-center space-x-2">
                  <FormikInput
                    className="w-20"
                    type="number"
                    name="duration"
                    placeholder="60"
                    label="Duration (sec)"
                  />
                  <FormikToggle name="clearDuration" label="Clear dur" />
                </div>
              </div>
              <div className="flex justify-center my-4">
                <RealButton
                  variant="blue2"
                  onClick={() => {
                    setIsUpdatingWorkout(false);
                    if (isValid) {
                      handleSubmit();
                    }
                  }}
                  isValid={isValid}
                >
                  {isEditingExercise ? "Update exercise" : "Add exercise"}
                </RealButton>
              </div>
            </div>
            <div className="flex justify-center mt-auto mb-3">
              <RealButton
                className="mt-4"
                variant="blue"
                type="submit"
                onClick={() => {
                  setIsUpdatingWorkout(true);
                  if (isValid) {
                    handleSubmit();
                  }
                }}
                isValid={isValid}
              >
                Update workout
              </RealButton>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
