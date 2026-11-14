import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Timer, Dumbbell, Play } from "lucide-react";
import { weekdayUpper, type WeekDay } from "@/app/_lib/weekday";

interface TodayWorkoutHeroProps {
  workoutPlanId: string;
  dayId: string;
  name: string;
  weekDay: WeekDay;
  estimatedDurationInSeconds: number;
  exercisesCount: number;
  coverImageUrl?: string;
  hasStarted?: boolean;
}

export function TodayWorkoutHero({
  workoutPlanId,
  dayId,
  name,
  weekDay,
  estimatedDurationInSeconds,
  exercisesCount,
  coverImageUrl,
  hasStarted = false,
}: TodayWorkoutHeroProps) {
  const durationInMinutes = Math.round(estimatedDurationInSeconds / 60);

  return (
    <div className="relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-xl p-6">
      {coverImageUrl && (
        <Image
          src={coverImageUrl}
          alt={name}
          fill
          className="pointer-events-none object-cover"
        />
      )}
      <div className="absolute inset-0 bg-foreground/40" />

      <div className="relative">
        <div className="flex items-center gap-1 rounded-full bg-background/16 px-2.5 py-1.5 backdrop-blur-sm w-fit">
          <Calendar className="size-3.5 text-background" />
          <span className="font-heading text-xs font-semibold uppercase text-background">
            {weekdayUpper(weekDay)}
          </span>
        </div>
      </div>

      <div className="relative flex flex-col gap-4">
        <div className="space-y-2">
          <p className="font-heading text-sm font-medium text-background/90">
            Treino de Hoje
          </p>
          <h2 className="font-heading text-3xl font-semibold leading-tight text-background">
            {name}
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Timer className="size-4 text-background/70" />
              <span className="font-heading text-sm text-background/70">
                {durationInMinutes}min
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Dumbbell className="size-4 text-background/70" />
              <span className="font-heading text-sm text-background/70">
                {exercisesCount} exercícios
              </span>
            </div>
          </div>
        </div>

        <Button asChild size="lg" className="w-full">
          <Link href={`/workout-plans/${workoutPlanId}/days/${dayId}`}>
            <Play className="size-4" />
            {hasStarted ? "Continuar treino" : "Iniciar treino"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
