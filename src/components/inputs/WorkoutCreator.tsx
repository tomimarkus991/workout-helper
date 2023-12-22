import { Form, Formik } from "formik";
import { useState } from "react";

import { FormikInput, RealButton } from "@/components";
import { cn } from "@/lib";

import { CreateWorkoutFormValues, YupSchemas } from "../../app-constants";

export const WorkoutCreator = () => {
  const [initialValues] = useState<CreateWorkoutFormValues>({
    name: "",
    time: 0,
    exercises: [],
  });
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={YupSchemas.CreateWorkout}
      validateOnChange={true}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);

        setSubmitting(false);
      }}
    >
      {({ isValid, handleSubmit }) => (
        <Form className={cn("max-w-sm mx-auto bg-white")}>
          <div className="flex flex-col p-4 space-y-4">
            <div className="font-bold text-center">L-sit</div>
            <FormikInput
              name="name"
              type="text"
              className="mt-2"
              placeholder="Change workout name"
            />
            <div className="p-2 bg-gray-200 rounded-md">
              <div className="flex justify-between bg-gray-200">
                <div>3x explosive pull-ups</div>
                <div>3 min rest</div>
              </div>
            </div>
            <div className="p-2 bg-gray-200 rounded-md">
              <div className="flex justify-between">
                <div>3x8-10 toes to bar</div>
                <div>3 min rest</div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <FormikInput name="name" type="text" placeholder="Name" />
              <div className="flex space-x-2">
                <FormikInput name="sets" type="text" placeholder="Sets" />
                <FormikInput name="reps" type="text" placeholder="Reps" />
                <FormikInput name="rest" type="text" placeholder="Rest" />
              </div>
            </div>
            <RealButton
              variant="blue"
              type="submit"
              onClick={handleSubmit as any}
              isValid={isValid}
            >
              Add Exercise
            </RealButton>
          </div>
          <RealButton variant="blue2" type="submit" onClick={handleSubmit as any} isValid={isValid}>
            Create Workout
          </RealButton>
        </Form>
      )}
    </Formik>
  );
};
