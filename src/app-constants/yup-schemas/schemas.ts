import * as yup from "yup";

const Exercise = yup.object().shape({
  exercise: yup.string().nullable().optional(),
  sets: yup.string().nullable().optional().min(1),
  reps: yup.string().nullable().optional().min(1),
  rest: yup.string().nullable().optional().min(0),
  order: yup.string().nullable().optional().min(0),
});

const CreateWorkout = yup.object().shape({
  name: yup.string().nullable().required("Name is required"),
  time: yup.string().nullable().min(0),
  exercises: yup.array().of(Exercise).default([]).required("Exercises are required"),
});

export type CreateWorkoutFormValues = yup.InferType<typeof CreateWorkout>;
export type ExerciseFormValues = yup.InferType<typeof Exercise>;

export const YupSchemas = { CreateWorkout, Exercise };
