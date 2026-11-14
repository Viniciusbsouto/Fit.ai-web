"use client";

import { useQueryStates, parseAsBoolean, parseAsString } from "nuqs";
import { Button } from "@/components/ui/button";

interface CoachPromptButtonProps {
  initialMessage?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  children: React.ReactNode;
}

export function CoachPromptButton({
  initialMessage,
  variant,
  size,
  className,
  children,
}: CoachPromptButtonProps) {
  const [, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  });

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() =>
        setChatParams({
          chat_open: true,
          chat_initial_message: initialMessage ?? null,
        })
      }
    >
      {children}
    </Button>
  );
}
