import { useState } from "react";

import { WorkoutInfo, WorkoutStart } from "@/components";

export const WorkoutPage = () => {
  const [isWorkingOut, setIsWorkingOut] = useState(false);

  return (
    <>
      {!isWorkingOut ? (
        <WorkoutInfo isWorkingOut={isWorkingOut} setIsWorkingOut={setIsWorkingOut} />
      ) : (
        <WorkoutStart isWorkingOut={isWorkingOut} setIsWorkingOut={setIsWorkingOut} />
      )}
    </>
  );
};
