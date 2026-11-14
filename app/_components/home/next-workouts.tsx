import dayjs from "dayjs";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Calendar, Timer, Dumbbell } from "lucide-react";
import { weekdayTitle, weekdayFromDate } from "@/app/_lib/weekday";
import type { GetWorkoutPlans200ItemWorkoutDaysItem } from "@/app/_lib/api/fetch-generated";

interface NextWorkoutsProps {
  workoutPlanId: string;
  workoutDays: GetWorkoutPlans200ItemWorkoutDaysItem[];
  today: dayjs.Dayjs;
}

function getNextWorkouts(
  workoutDays: GetWorkoutPlans200ItemWorkoutDaysItem[],
  today: dayjs.Dayjs
) {
  const todayWeekDay = weekdayFromDate(today);
  const todayIndex = workoutDays.findIndex((d) => d.weekDay === todayWeekDay);

  const upcomingDays = [
    ...workoutDays.slice(todayIndex + 1),
    ...workoutDays.slice(0, todayIndex),
  ].filter((d) => !d.isRest);

  return upcomingDays.slice(0, 3);
}

export function NextWorkouts({
  workoutPlanId,
  workoutDays,
  today,
}: NextWorkoutsProps) {
  const nextWorkouts = getNextWorkouts(workoutDays, today);

  if (nextWorkouts.length === 0) return null;

  return (
    <div className="space-y-3">
      {nextWorkouts.map((workout) => {
        const durationInMinutes = Math.round(
          workout.estimatedDurationInSeconds / 60
        );
        const exercisesCount = workout.exercises?.length ?? 0;

        return (
          <Link
            key={workout.id}
            href={`/workout-plans/${workoutPlanId}/days/${workout.id}`}
          >
            <Card className="p-4 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="size-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-heading text-sm font-semibold text-foreground">
                    {workout.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {weekdayTitle(workout.weekDay)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Timer className="size-3.5" />
                    <span>{durationInMinutes}min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Dumbbell className="size-3.5" />
                    <span>{exercisesCount}</span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
