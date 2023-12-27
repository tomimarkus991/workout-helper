import { Link } from "@tanstack/react-router";
import { Form, Formik } from "formik";
import { useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { v4 as genUuid } from "uuid";

import { CreateWorkoutFormValues, ExerciseFormValues, YupSchemas } from "@/app-constants";
import { FormikInput, FormikToggle, RealButton } from "@/components";
import { useCreateExercise, useCreateWorkout, useCreateWorkoutExercise, useSession } from "@/hooks";
import { cn } from "@/lib";

export const WorkoutCreator = () => {
  const { mutateAsync: createWorkout } = useCreateWorkout();
  const { mutateAsync: createExercise } = useCreateExercise();
  const { mutateAsync: createWorkoutExercise } = useCreateWorkoutExercise();

  const { data: user } = useSession();

  const [initialValues] = useState<CreateWorkoutFormValues>({
    name: "",
    averageCompletionTime: "" as unknown as number,
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
          image = `${Math.floor(Math.random() * 11 + 1)}w.jpg`,
          exercises,
          name,
        } = values;

        const workoutId = genUuid();

        await createWorkout({
          id: workoutId,
          workout_name: name,
          average_completion_time:
            typeof averageCompletionTime === "string" ? 0 : averageCompletionTime,
          sequential_sets: sequentialSets || true,
          image,
          profile_id: user?.user.id as string,
        });

        console.log(exercises);

        for await (const { reps, rest, sets, duration, exercise, order } of exercises) {
          const exerciseId = genUuid();

          await createExercise({
            id: exerciseId,
            exercise_name: exercise,
            order,
            reps: typeof reps === "string" ? 0 : reps,
            sets,
            rest,
            duration: typeof duration === "string" ? 0 : duration,
          });
          await createWorkoutExercise({
            exercise_id: exerciseId,
            workout_id: workoutId,
          });
        }

        resetForm();
        setSubmitting(false);
      }}
    >
      {({ isValid, handleSubmit, values, setFieldValue }) => (
        <Form className={cn("max-w-md min-h-screen p-2 flex flex-col")}>
          <div className="flex flex-row items-center justify-between my-5">
            <Link to="/">
              <HiArrowLeft className="icon" />
            </Link>
            <p className="text-3xl font-semibold text-center">Create Workout</p>
            <HiArrowLeft className="opacity-0 icon" />
          </div>
          <div className="mb-5">
            <div className="flex space-x-1">
              <FormikInput name="name" placeholder="L-Sit" label="Workout name" />
              <FormikInput
                name="time"
                type="number"
                placeholder="60"
                label="Average completion (min)"
              />
            </div>
            <FormikToggle name="sequentialSets" disabled label="Finish one exercise's sets first" />
          </div>
          <div className="space-y-2">
            {values.exercises?.map(exercise => {
              return (
                <div key={exercise.exercise} className="p-2 border border-blue-600 rounded-lg">
                  <div className="flex flex-row justify-between">
                    <p>
                      {exercise.sets}x {exercise.reps} {exercise.exercise}
                    </p>

                    <p>{exercise.rest ? Number(exercise.rest) / 60 : 0} min rest</p>
                  </div>
                </div>
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
                { setSubmitting: _setSubmitting, resetForm: _resetForm },
              ) => {
                _setSubmitting(true);

                const exerciseValuesWithOrder = {
                  ...exerciseValues,
                  order: values.exercises.length + 1,
                };

                setFieldValue("exercises", [...values.exercises, exerciseValuesWithOrder]);
                _resetForm();

                _setSubmitting(false);
              }}
            >
              {({ handleSubmit: handleExerciseSubmit, isValid: _isValid }) => (
                <Form>
                  <FormikInput name="exercise" placeholder="Scapula shrugs" label="Exercise name" />
                  <div className="flex mt-1 mb-2 space-x-1">
                    <FormikInput type="number" name="sets" placeholder="3" label="Sets" />
                    <FormikInput type="number" name="rest" placeholder="180" label="Rest (sec)" />
                  </div>

                  <div className="flex items-center mt-1 mb-2 space-x-2">
                    <FormikInput type="number" name="reps" placeholder="10" label="Reps" />
                    <span className="mt-5">or</span>
                    <FormikInput
                      type="number"
                      name="duration"
                      placeholder="60"
                      label="Duration (sec)"
                    />
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
      )}
    </Formik>
  );
};
