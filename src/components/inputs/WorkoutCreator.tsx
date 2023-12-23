import { Form, Formik } from "formik";
import { useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";

import { CreateWorkoutFormValues, ExerciseFormValues, YupSchemas } from "@/app-constants";
import { FormikInput, FormikToggle, RealButton } from "@/components";
import { cn } from "@/lib";

import { definedRoutes } from "../../routes";

export const WorkoutCreator = () => {
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
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={YupSchemas.CreateWorkout}
      validateOnChange={true}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);

        console.log(values);
        resetForm();
        setSubmitting(false);
      }}
    >
      {({ isValid, handleSubmit, values, setFieldValue }) => (
        <Form className={cn("max-w-md min-h-screen p-2 flex flex-col")}>
          <div className="flex flex-row items-center justify-between my-5">
            <Link to={definedRoutes.workoutsPage}>
              <HiArrowLeft className="icon" />
            </Link>
            <p className="text-3xl font-semibold text-center">Create Workout</p>
            <HiArrowLeft className="opacity-0 icon" />
          </div>
          <div className="mb-5 ">
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
                <div key={exercise.exercise} className="p-2 bg-gray-200 rounded-md">
                  <div className="flex justify-between bg-gray-200">
                    <div>
                      <span>{exercise.sets}x</span>
                      <span>{exercise.reps}</span> <span>{exercise.exercise}</span>
                    </div>

                    <div>{exercise.rest ? Number(exercise.rest) / 60 : 0} min rest</div>
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

                setFieldValue("exercises", [...values.exercises, exerciseValues]);
                _resetForm();

                _setSubmitting(false);
              }}
            >
              {({ handleSubmit: handleExerciseSubmit, isValid: _isValid }) => (
                <Form>
                  <FormikInput name="exercise" placeholder="Scapula shrugs" label="Exercise name" />
                  <div className="flex mt-1 mb-2 space-x-2">
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
