import { endOfWeek, format, getDate, getWeek, secondsToMinutes, startOfWeek } from "date-fns";

import { NavbarBottom } from "../components";
import { useGetAllWorkoutsStats } from "../hooks/query/useGetAllWorkoutStats";

export const StatisticsPage = () => {
  const { data: workoutStats } = useGetAllWorkoutsStats();
  const currentDate = new Date();

  const firstDayOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

  const lastDayOfWeek = endOfWeek(currentDate, { weekStartsOn: 1 });

  const formattedFirstDay = format(firstDayOfWeek, "MMM d");
  const formattedLastDay = format(lastDayOfWeek, "MMM d");

  return (
    <>
      <div className="m-6 mb-28">
        <div className="mb-6">
          <p className="text-2xl font-semibold">Weekly Stats</p>
          <p className="text-neutral-300">
            You completed {workoutStats?.length} workouts this week. Keep it up!
          </p>
        </div>
        <div className="flex flex-row items-center">
          <div className="mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="text-gray-300 size-10"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
              <line x1="16" x2="16" y1="2" y2="6"></line>
              <line x1="8" x2="8" y1="2" y2="6"></line>
              <line x1="3" x2="21" y1="10" y2="10"></line>
            </svg>
          </div>
          <div>
            <p className="text-xl font-semibold">Week {getWeek(currentDate)}</p>
            <p>
              {formattedFirstDay} - {formattedLastDay}
            </p>
          </div>
        </div>
        <table className="w-full mt-5">
          <thead>
            <tr>
              <th className="text-left">Date</th>
              <th className="text-left">Workout</th>
              <th className="text-left">Time (min)</th>
            </tr>
          </thead>
          <tbody>
            {workoutStats?.map(workout => {
              return (
                <tr key={workout.id}>
                  <td>{getDate(workout.created_at)}</td>
                  <td>{workout.workout?.workout_name}</td>
                  <td>{secondsToMinutes(workout?.completion_time || 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <NavbarBottom />
    </>
  );
};
