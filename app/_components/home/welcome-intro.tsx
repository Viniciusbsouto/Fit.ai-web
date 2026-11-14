import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface WelcomeIntroProps {
  userName: string;
}

export function WelcomeIntro({ userName }: WelcomeIntroProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-3">
            <Sparkles className="size-6 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Bem-vindo, {userName}!
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Para começar sua jornada fitness, vamos entender seu perfil e
              objetivos. Nosso treinador de IA vai criar um plano personalizado
              para você.
            </p>
          </div>
        </div>
        <Button asChild className="w-full">
          <Link href="/onboarding">Começar agora</Link>
        </Button>
      </div>
    </Card>
  );
}
