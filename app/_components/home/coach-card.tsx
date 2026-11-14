import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { CoachPromptButton } from "./coach-prompt-button";

export function CoachCard() {
  return (
    <Card className="bg-primary/5 p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary p-2.5">
          <Sparkles className="size-5 text-primary-foreground" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-1">
            <h3 className="font-heading text-sm font-semibold text-foreground">
              Treinador IA
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Tire dúvidas, ajuste treinos ou peça orientações personalizadas
            </p>
          </div>
          <CoachPromptButton
            variant="outline"
            size="sm"
            className="w-full"
            initialMessage="Pode revisar meu treino de hoje?"
          >
            Conversar agora
          </CoachPromptButton>
        </div>
      </div>
    </Card>
  );
}
