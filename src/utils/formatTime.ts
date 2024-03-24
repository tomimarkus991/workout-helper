import { setHours, add, format } from "date-fns";

export const formatTime = (totalSeconds: number, desiredFormat = "mm:ss") => {
  if (totalSeconds <= 0) {
    return "00:00";
  }
  const baseDate = setHours(new Date(), 0).setMinutes(0, 0, 0);
  const date = add(baseDate, { seconds: totalSeconds });

  return format(date, desiredFormat);
};
