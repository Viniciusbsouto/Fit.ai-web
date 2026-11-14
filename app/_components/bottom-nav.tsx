import Link from "next/link";
import { House, Calendar, ChartNoAxesColumn, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatOpenButton } from "@/app/_components/chat-open-button";

interface BottomNavProps {
  activePage?: "home" | "calendar" | "stats" | "profile";
  activeWorkoutPlanId?: string | null;
}

const NAV_ITEM_CLASS = "flex size-11 items-center justify-center rounded-full";

export function BottomNav({
  activePage = "home",
  activeWorkoutPlanId,
}: BottomNavProps) {
  const calendarHref = activeWorkoutPlanId
    ? `/workout-plans/${activeWorkoutPlanId}`
    : "/onboarding";

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-4 rounded-t-[20px] border border-border bg-background px-6 py-4"
    >
      <Link
        href="/"
        aria-label="Início"
        aria-current={activePage === "home" ? "page" : undefined}
        className={NAV_ITEM_CLASS}
      >
        <House
          className={cn(
            "size-6",
            activePage === "home" ? "text-foreground" : "text-muted-foreground"
          )}
        />
      </Link>

      <Link
        href={calendarHref}
        aria-label="Plano de treino"
        aria-current={activePage === "calendar" ? "page" : undefined}
        className={NAV_ITEM_CLASS}
      >
        <Calendar
          className={cn(
            "size-6",
            activePage === "calendar"
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        />
      </Link>

      <ChatOpenButton />

      <Link
        href="/stats"
        aria-label="Estatísticas"
        aria-current={activePage === "stats" ? "page" : undefined}
        className={NAV_ITEM_CLASS}
      >
        <ChartNoAxesColumn
          className={cn(
            "size-6",
            activePage === "stats" ? "text-foreground" : "text-muted-foreground"
          )}
        />
      </Link>

      <Link
        href="/profile"
        aria-label="Perfil"
        aria-current={activePage === "profile" ? "page" : undefined}
        className={NAV_ITEM_CLASS}
      >
        <UserRound
          className={cn(
            "size-6",
            activePage === "profile"
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        />
      </Link>
    </nav>
  );
}
