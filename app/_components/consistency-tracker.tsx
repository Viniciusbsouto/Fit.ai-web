import dayjs from "dayjs";
import type { GetHomeData200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";
import { ConsistencySquare } from "./consistency-square";
import { weekdayShort, WEEKDAY_ORDER, getWeekDates } from "@/app/_lib/weekday";

interface ConsistencyTrackerProps {
  consistencyByDay: GetHomeData200ConsistencyByDay;
  today: dayjs.Dayjs;
}

export function ConsistencyTracker({
  consistencyByDay,
  today,
}: ConsistencyTrackerProps) {
  const weekDates = getWeekDates(today);
  const todayStr = today.format("YYYY-MM-DD");

  return (
    <div className="flex items-center justify-between">
      {weekDates.map((date, index) => {
        const dateStr = date.format("YYYY-MM-DD");
        const dayData = consistencyByDay[dateStr];
        const weekDay = WEEKDAY_ORDER[index];
        return (
          <div key={dateStr} className="flex flex-col items-center gap-1.5">
            <ConsistencySquare
              completed={dayData?.workoutDayCompleted ?? false}
              started={dayData?.workoutDayStarted ?? false}
              isToday={dateStr === todayStr}
            />
            <span className="font-heading text-xs text-muted-foreground">
              {weekdayShort(weekDay)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
