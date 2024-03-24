import { Link } from "@tanstack/react-router";
import { Form, Formik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { HiArrowLeft } from "react-icons/hi";
import { v4 as genUuid } from "uuid";

import { CreateWorkoutFormValues, ExerciseFormValues, YupSchemas } from "../../app-constants";
import { useCreateWorkout, useCreateExercise, useSession } from "../../hooks";
import { cn } from "../../lib";
import { RealButton } from "../button";
import { FormikExerciseCard } from "../cards";

import { FormikInput } from "./FormikInput";
import { FormikToggle } from "./FormikToggle";

export const WorkoutCreator = () => {
  const { mutateAsync: createWorkout } = useCreateWorkout();
  const { mutateAsync: createExercise } = useCreateExercise();

  const { data: user } = useSession();

  const [initialValues] = useState<CreateWorkoutFormValues>({
    name: "",
    averageCompletionTime: "" as unknown as number,
    completeDurationExerciseOnEnd: false,
    sequentialSets: true,
    exercises: [],
  });
  const [initialValuesExercise] = useState<ExerciseFormValues>({
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
      validationSchema={YupSchemas.CreateWorkout}
      validateOnChange={true}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);

        const {
          sequentialSets,
          averageCompletionTime,
          completeDurationExerciseOnEnd,
          image = `${Math.floor(Math.random() * 11 + 1)}w.jpg`,
          exercises,
          name,
        } = values;

        const workoutId = genUuid();

        if (!sequentialSets) {
          const firstExerciseSets = exercises[0].sets;

          for (const exercise of exercises) {
            if (exercise.sets !== firstExerciseSets) {
              toast.error("All exercises must have the same number of sets, when not sequential.");
              return;
            }
          }
        }

        await createWorkout({
          id: workoutId,
          workout_name: name,
          average_completion_time:
            typeof averageCompletionTime === "string" ? 0 : averageCompletionTime,
          sequential_sets: sequentialSets,
          complete_duration_exercise_on_end: completeDurationExerciseOnEnd || false,
          image,
          profile_id: user?.user.id as string,
        });

        for await (const { reps, rest, sets, duration, exercise, order } of exercises) {
          const exerciseId = genUuid();

          await createExercise({
            id: exerciseId,
            exercise_name: exercise,
            order,
            reps: typeof reps === "string" ? 0 : reps,
            sets,
            rest: typeof rest === "string" ? 0 : rest,
            duration: typeof duration === "string" ? 0 : duration,
            workout_id: workoutId,
          });
        }

        resetForm();
        setSubmitting(false);
      }}
    >
      {({ isValid, handleSubmit, values, setFieldValue }) => {
        return (
          <Form className={cn("max-w-md mx-auto min-h-screen p-2 flex flex-col")}>
            <div className="flex flex-row items-center justify-between my-5">
              <Link to="/">
                <HiArrowLeft className="icon" />
              </Link>
              <p className="text-3xl font-semibold text-center">Create Workout</p>
              <HiArrowLeft className="opacity-0 icon" />
            </div>
            <div className="mb-5">
              <FormikInput name="name" placeholder="L-Sit" label="Workout name" />
              <FormikToggle name="sequentialSets" label="Finish one exercise's sets first" />
              <FormikToggle
                name="completeDurationExerciseOnEnd"
                label="Start rest immediately after exercise duration ends"
              />
            </div>
            <div className="space-y-2">
              {values.exercises?.map(exercise => {
                return (
                  <FormikExerciseCard
                    key={exercise.exercise}
                    duration={exercise.duration}
                    sets={exercise.sets}
                    reps={exercise.reps}
                    rest={exercise.rest}
                    name={exercise.exercise}
                  />
                );
              })}
            </div>
            <div className="flex flex-col space-y-2">
              <Formik
                initialValues={initialValuesExercise}
                validationSchema={YupSchemas.CreateExercise}
                validateOnChange={true}
                onSubmit={(
                  exerciseValues,
                  { setSubmitting: _setSubmitting, setFieldValue: _setFieldValue },
                ) => {
                  _setSubmitting(true);

                  const exerciseValuesWithOrder = {
                    ...exerciseValues,
                    order: values.exercises.length + 1,
                  };

                  setFieldValue("exercises", [...values.exercises, exerciseValuesWithOrder]);

                  _setFieldValue("exercise", "");

                  if (exerciseValues.clearSets) {
                    _setFieldValue("sets", "");
                  }
                  if (exerciseValues.clearRest) {
                    _setFieldValue("rest", "");
                  }
                  if (exerciseValues.clearReps) {
                    _setFieldValue("reps", "");
                  }
                  if (exerciseValues.clearDuration) {
                    _setFieldValue("duration", "");
                  }

                  _setSubmitting(false);
                }}
              >
                {({ handleSubmit: handleExerciseSubmit, isValid: _isValid }) => (
                  <Form>
                    <FormikInput
                      name="exercise"
                      placeholder="Scapula shrugs"
                      label="Exercise name"
                    />
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
                        variant="blue"
                        onClick={handleExerciseSubmit as any}
                        isValid={_isValid}
                      >
                        Add exercise
                      </RealButton>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="flex justify-center mt-auto mb-3">
              <RealButton
                variant="blue2"
                type="submit"
                onClick={handleSubmit as any}
                isValid={isValid}
              >
                Create workout
              </RealButton>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
