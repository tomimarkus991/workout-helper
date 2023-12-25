import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Route,
  Router,
  RouterProvider,
  redirect,
  rootRouteWithContext,
} from "@tanstack/react-router";
import { setDefaultOptions } from "date-fns";
import { et } from "date-fns/locale";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import {
  CreateWorkoutPage,
  LoginPage,
  NotesPage,
  ProfilePage,
  RegisterPage,
  WorkoutPage,
  WorkoutsPage,
} from "@/pages";

import { supabase } from "./utils";

setDefaultOptions({ locale: et });

const root = createRoot(document.getElementById("root") as HTMLElement);

const queryClient = new QueryClient();

const RootComponent = () => {
  return (
    <>
      <Outlet />
      {/* <ReactQueryDevtools buttonPosition="top-right" /> */}
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </>
  );
};

const rootRoute = rootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();

    if (
      location.pathname === "/login" ||
      location.pathname === "/register" ||
      location.pathname === "/"
    ) {
      return;
    }

    if (!data?.session?.user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: WorkoutsPage,
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});
const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});
const profileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});
const notesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/notes",
  component: NotesPage,
});
const workoutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/workout/$id",
  component: WorkoutPage,
});
const createWorkoutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/create-workout",
  component: CreateWorkoutPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  workoutRoute,
  loginRoute,
  registerRoute,
  profileRoute,
  notesRoute,
  createWorkoutRoute,
]);

const router = new Router({
  routeTree,
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  context: {
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);

// // @ts-ignore
// // eslint-disable-next-line import/no-unresolved
// import { useRegisterSW } from "virtual:pwa-register/react";
// const useRegisterPWA = () => {
//   const intervalMS = 60 * 60 * 1000; // 1 hour

//   useRegisterSW({
//     onRegistered(r: any) {
//       r &&
//         setInterval(() => {
//           r.update();
//         }, intervalMS);
//     },
//   });
// };

// useRegisterPWA();
