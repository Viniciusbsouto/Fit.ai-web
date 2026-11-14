import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { CoachPromptButton } from "./coach-prompt-button";

export function NoPlanCard() {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-3">
            <Calendar className="size-6 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Crie seu primeiro plano
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Converse com o treinador de IA para gerar um plano de treinos
              personalizado baseado no seu perfil e objetivos.
            </p>
          </div>
        </div>
        <CoachPromptButton
          className="w-full"
          initialMessage="Quero criar um plano de treino para mim."
        >
          Falar com treinador
        </CoachPromptButton>
      </div>
    </Card>
  );
}
