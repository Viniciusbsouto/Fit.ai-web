import { cn } from "@/lib/utils";
import { weekdayShort, type WeekDay } from "@/app/_lib/weekday";
import { CheckCircle2, Circle } from "lucide-react";

interface WeekDayCellProps {
  weekDay: WeekDay;
  isToday: boolean;
  isCompleted: boolean;
  isStarted: boolean;
  isRest: boolean;
}

export function WeekDayCell({
  weekDay,
  isToday,
  isCompleted,
  isStarted,
  isRest,
}: WeekDayCellProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg p-3 transition-colors",
        isToday && "bg-primary/5 ring-1 ring-primary/20",
        !isToday && "bg-muted/30"
      )}
    >
      <span
        className={cn(
          "font-heading text-xs font-semibold uppercase",
          isToday ? "text-primary" : "text-muted-foreground"
        )}
      >
        {weekdayShort(weekDay)}
      </span>

      {isRest ? (
        <div className="size-8 rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/50" />
      ) : isCompleted ? (
        <CheckCircle2 className="size-8 text-primary" />
      ) : isStarted ? (
        <Circle className="size-8 text-primary/40" />
      ) : (
        <Circle
          className={cn(
            "size-8",
            isToday ? "text-primary/60" : "text-muted-foreground/30"
          )}
        />
      )}
    </div>
  );
}
