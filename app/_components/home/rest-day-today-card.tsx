import { Card } from "@/components/ui/card";
import { Moon } from "lucide-react";

export function RestDayTodayCard() {
  return (
    <Card className="border-border/50 bg-muted/30 p-6">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-muted p-4">
          <Moon className="size-8 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            Dia de Descanso
          </h3>
          <p className="text-sm text-muted-foreground">
            Aproveite para recuperar os músculos
          </p>
        </div>
      </div>
    </Card>
  );
}
