import { Route, Routes } from "react-router-dom";
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { useRegisterSW } from "virtual:pwa-register/react";

import { ErrorPage } from "@/pages";
import { routes } from "@/routes";

const useRegisterPWA = () => {
  const intervalMS = 60 * 60 * 1000; // 1 hour

  useRegisterSW({
    onRegistered(r: any) {
      r &&
        setInterval(() => {
          r.update();
        }, intervalMS);
    },
  });
};

export const Router = () => {
  useRegisterPWA();

  return (
    <Routes>
      {routes.map(route => (
        <Route key={route.to} path={route.to} element={route.element} />
      ))}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};
