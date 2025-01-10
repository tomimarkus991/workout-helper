import { useState } from "react";

import { WorkoutInfo, WorkoutStart } from "../components";

export const WorkoutPage = () => {
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [workoutSpeed, setWorkoutSpeed] = useState(1);

  return (
    <>
      {!isWorkingOut ? (
        <WorkoutInfo
          isWorkingOut={isWorkingOut}
          setIsWorkingOut={setIsWorkingOut}
          setWorkoutSpeed={setWorkoutSpeed}
        />
      ) : (
        <WorkoutStart
          isWorkingOut={isWorkingOut}
          setIsWorkingOut={setIsWorkingOut}
          workoutSpeed={workoutSpeed}
        />
      )}
    </>
  );
};
// Android Studio Iguana | 2023.2.1 Patch 1
// Build #AI-232.10300.40.2321.11567975, built on March 13, 2024
// Runtime version: 17.0.9+0--11185874 amd64
// VM: OpenJDK 64-Bit Server VM by JetBrains s.r.o.
// Windows 10.0
// GC: G1 Young Generation, G1 Old Generation
// Memory: 4084M
// Cores: 16
