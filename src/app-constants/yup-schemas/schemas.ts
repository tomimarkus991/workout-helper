import * as yup from "yup";

const CreateExercise = yup
  .object()
  .shape({
    exercise: yup.string().required("Exercise name is required").default(""),
    sets: yup.number().min(1).typeError("Sets are required").required("Sets are required"),
    reps: yup.number().min(0).default(0).optional(),
    duration: yup.number().min(0).default(0).optional(),
    rest: yup.number().min(0).default(0),
    order: yup.number().min(0).default(0),
    clearSets: yup.boolean().default(false),
    clearRest: yup.boolean().default(false),
    clearReps: yup.boolean().default(false),
    clearDuration: yup.boolean().default(false),
  })
  .test("reps-duration", "Either reps or duration can be set", function (value) {
    const { reps, duration } = value;
    if (reps && duration) {
      return this.createError({
        message: "Either reps or duration can be set",
        path: "reps",
      });
    }
    return true;
  });
const CreateWorkout = yup.object().shape({
  name: yup.string().nullable().required("Name is required"),
  averageCompletionTime: yup.number().min(0).default(0),
  image: yup.string().nullable(),
  sequentialSets: yup.boolean(),
  exercises: yup.array().of(CreateExercise).default([]).required("Exercises are required"),
  completeDurationExerciseOnEnd: yup.boolean().nullable().default(false),
});

const Login = yup.object().shape({
  email: yup.string().email().required("Required"),
  password: yup.string().required("Required"),
});
const Register = yup.object().shape({
  username: yup.string().min(3, "Username must be at least 3 characters long").required("Required"),
  email: yup.string().email().required("Required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .matches(/[a-zA-Z0-9]/, "Password can only contain Latin letters or numbers")
    .required("Required"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Required"),
});

export type CreateWorkoutFormValues = yup.InferType<typeof CreateWorkout>;
export type Workout = yup.InferType<typeof CreateWorkout> & { id: string; duration: number };
export type ExerciseFormValues = yup.InferType<typeof CreateExercise>;
export type Exercise = yup.InferType<typeof CreateExercise> & { id: string };

export const YupSchemas = { CreateWorkout, CreateExercise, Login, Register };
