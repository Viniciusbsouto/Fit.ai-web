import dayjs from "dayjs";
import { Card } from "@/components/ui/card";
import { WeekDayCell } from "./week-day-cell";
import { WEEKDAY_ORDER, getWeekDates } from "@/app/_lib/weekday";
import type {
  GetHomeData200ConsistencyByDay,
  GetWorkoutPlans200ItemWorkoutDaysItem,
} from "@/app/_lib/api/fetch-generated";

interface WeekOverviewProps {
  workoutDays: GetWorkoutPlans200ItemWorkoutDaysItem[];
  consistencyByDay: GetHomeData200ConsistencyByDay;
  today: dayjs.Dayjs;
}

export function WeekOverview({
  workoutDays,
  consistencyByDay,
  today,
}: WeekOverviewProps) {
  const weekDates = getWeekDates(today);
  const todayStr = today.format("YYYY-MM-DD");

  const workoutDaysByWeekDay = Object.fromEntries(
    workoutDays.map((day) => [day.weekDay, day])
  );

  return (
    <Card className="p-4">
      <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">
        Visão Semanal
      </h3>
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date, index) => {
          const dateStr = date.format("YYYY-MM-DD");
          const weekDay = WEEKDAY_ORDER[index];
          const dayData = consistencyByDay[dateStr];
          const workoutDay = workoutDaysByWeekDay[weekDay];

          return (
            <WeekDayCell
              key={dateStr}
              weekDay={weekDay}
              isToday={dateStr === todayStr}
              isCompleted={dayData?.workoutDayCompleted ?? false}
              isStarted={dayData?.workoutDayStarted ?? false}
              isRest={workoutDay?.isRest ?? false}
            />
          );
        })}
      </div>
    </Card>
  );
}
