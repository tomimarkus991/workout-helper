import {
  CreateWorkoutPage,
  WorkoutsPage,
  NotesPage,
  ProfilePage,
  LoginPage,
  RegisterPage,
  WorkoutPage,
} from "@/pages";
import { IRegularRouter } from "@/types";

export const definedRoutes = {
  workoutsPage: "/",
  profile: "/profile",
  notes: "/notes",
  createWorkout: "/create-workout",
  workoutPage: "/workout",
  login: "/login",
  register: "/register",
};

export const routes: IRegularRouter[] = [
  {
    to: definedRoutes.workoutsPage,
    element: <WorkoutsPage />,
  },
  {
    to: definedRoutes.login,
    element: <LoginPage />,
  },
  {
    to: definedRoutes.register,
    element: <RegisterPage />,
  },
];

export const privateRoutes: IRegularRouter[] = [
  {
    to: definedRoutes.createWorkout,
    element: <CreateWorkoutPage />,
  },
  {
    to: definedRoutes.profile,
    element: <ProfilePage />,
  },
  {
    to: definedRoutes.notes,
    element: <NotesPage />,
  },
  {
    to: `${definedRoutes.workoutPage}/:id`,
    element: <WorkoutPage />,
  },
];
