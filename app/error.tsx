"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <h2 className="font-heading text-xl font-semibold text-foreground">
        Algo deu errado
      </h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Não foi possível carregar esta página. Tente novamente em alguns
        instantes.
      </p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}
