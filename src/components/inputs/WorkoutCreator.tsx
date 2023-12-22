import { Form, Formik } from "formik";
import { useState } from "react";

import { CreateWorkoutFormValues, ExerciseFormValues, YupSchemas } from "@/app-constants";
import { FormikInput, RealButton } from "@/components";
import { cn } from "@/lib";

export const WorkoutCreator = () => {
  const [initialValues] = useState<CreateWorkoutFormValues>({
    name: "",
    time: "",
    exercises: [],
  });
  const [initialValuesExercise] = useState<ExerciseFormValues>({
    exercise: "",
    sets: "",
    reps: "",
    rest: "",
    order: "",
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
        <Form className={cn("max-w-md h-[60vh] p-2 flex flex-col")}>
          <p className="mt-10 mb-5 text-3xl font-semibold text-center">Create Workout</p>
          <div className="flex mb-5 space-x-1">
            <FormikInput name="name" placeholder="L-Sit" label="Workout name" />
            <FormikInput
              name="time"
              type="number"
              placeholder="60"
              label="Average completion minutes"
            />
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
              validationSchema={YupSchemas.Exercise}
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
                    <FormikInput type="number" name="reps" placeholder="10" label="Reps" />
                    <FormikInput type="number" name="rest" placeholder="180" label="Rest seconds" />
                  </div>
                  <div className="flex justify-center mb-4">
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
