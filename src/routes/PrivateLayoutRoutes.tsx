import { Navigate, Outlet } from "react-router-dom";

import { useSession } from "@/hooks";

export const PrivateLayoutRoutes = () => {
  const { isLoading, data } = useSession();

  // when useUser is authenticating
  if (isLoading) {
    return <></>;
  }

  return (
    // If Error redirect to the login page
    // Otherwise, render the page
    !data?.user ? <Navigate to="/login" /> : <Outlet />
  );
};
