import { Calendar, Zap } from "lucide-react";
import { weekdayUpper, type WeekDay } from "@/app/_lib/weekday";

interface RestDayCardProps {
  weekDay: WeekDay;
}

export function RestDayCard({ weekDay }: RestDayCardProps) {
  return (
    <div className="flex h-[110px] w-full flex-col items-start justify-between rounded-xl bg-muted p-5">
      <div className="flex items-center gap-1 rounded-full bg-foreground/8 px-2.5 py-1.5 backdrop-blur-sm">
        <Calendar className="size-3.5 text-foreground" />
        <span className="font-heading text-xs font-semibold uppercase text-foreground">
          {weekdayUpper(weekDay)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Zap className="size-5 text-foreground" />
        <span className="font-heading text-2xl font-semibold leading-[1.05] text-foreground">
          Descanso
        </span>
      </div>
    </div>
  );
}
