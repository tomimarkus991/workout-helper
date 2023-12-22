import * as yup from "yup";

const CreateWorkout = yup.object().shape({
  name: yup.string().required("Name is required"),
  time: yup.number().optional(),
  exercises: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Name is required"),
      sets: yup.number().optional(),
      reps: yup.number().optional(),
      rest: yup.number().optional(),
    }),
  ),
});

export type CreateWorkoutFormValues = yup.InferType<typeof CreateWorkout>;

export const YupSchemas = { CreateWorkout };
