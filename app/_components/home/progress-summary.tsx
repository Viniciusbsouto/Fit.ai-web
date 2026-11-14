import { Card } from "@/components/ui/card";
import { Flame, Target, TrendingUp } from "lucide-react";

interface ProgressSummaryProps {
  workoutStreak: number;
  completedWorkoutsCount?: number;
  conclusionRate?: number;
}

export function ProgressSummary({
  workoutStreak,
  completedWorkoutsCount,
  conclusionRate,
}: ProgressSummaryProps) {
  return (
    <Card className="p-5">
      <h3 className="mb-4 font-heading text-sm font-semibold text-foreground">
        Seu Progresso
      </h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="rounded-full bg-streak p-2.5">
            <Flame className="size-5 text-streak-foreground" />
          </div>
          <div>
            <p className="font-heading text-xl font-bold text-foreground">
              {workoutStreak}
            </p>
            <p className="text-xs text-muted-foreground">dias</p>
          </div>
        </div>

        {completedWorkoutsCount !== undefined && (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-primary/10 p-2.5">
              <Target className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-heading text-xl font-bold text-foreground">
                {completedWorkoutsCount}
              </p>
              <p className="text-xs text-muted-foreground">treinos</p>
            </div>
          </div>
        )}

        {conclusionRate !== undefined && (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-primary/10 p-2.5">
              <TrendingUp className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-heading text-xl font-bold text-foreground">
                {Math.round(conclusionRate * 100)}%
              </p>
              <p className="text-xs text-muted-foreground">conclusão</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
