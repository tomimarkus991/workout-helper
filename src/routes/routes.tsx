import { CreateWorkoutPage, WorkoutsPage, NotesPage, ProfilePage } from "@/pages";
import { IRegularRouter } from "@/types";

export const definedRoutes = {
  workoutsPage: "/",
  profile: "/profile",
  notes: "/notes",
  createWorkout: "/create-workout",
};

export const routes: IRegularRouter[] = [
  {
    to: definedRoutes.workoutsPage,
    element: <WorkoutsPage />,
  },
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
];
