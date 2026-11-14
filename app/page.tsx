import { redirect } from "next/navigation";
import { headers } from "next/headers";
import dayjs from "dayjs";
import { authClient } from "@/app/_lib/auth-client";
import {
  getHomeData,
  getStats,
  getUserTrainData,
  getWorkoutPlans,
} from "./_lib/api/fetch-generated";
import { BottomNav } from "./_components/bottom-nav";
import { HomeHeader } from "./_components/home/home-header";
import { WelcomeIntro } from "./_components/home/welcome-intro";
import { NoPlanCard } from "./_components/home/no-plan-card";
import { TodayWorkoutHero } from "./_components/home/today-workout-hero";
import { RestDayTodayCard } from "./_components/home/rest-day-today-card";
import { WeekOverview } from "./_components/home/week-overview";
import { NextWorkouts } from "./_components/home/next-workouts";
import { ProgressSummary } from "./_components/home/progress-summary";
import { CoachCard } from "./_components/home/coach-card";
import { SectionHeader } from "./_components/home/section-header";

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs();
  const [homeData, trainData] = await Promise.all([
    getHomeData(today.format("YYYY-MM-DD")),
    getUserTrainData(),
  ]);

  if (homeData.status !== 200 || trainData.status !== 200) {
    throw new Error("Failed to fetch home data");
  }

  const userName = session.data.user.name?.split(" ")[0] ?? "";

  if (!trainData.data) {
    return (
      <div className="flex min-h-svh flex-col bg-background pb-24">
        <HomeHeader
          userName={userName}
          greeting="Vamos começar sua jornada?"
          imageSrc="/home-banner.jpg"
        />
        <div className="mx-auto w-full max-w-6xl animate-slide-up px-5 pt-6">
          <WelcomeIntro userName={userName} />
        </div>
        <BottomNav activePage="home" />
      </div>
    );
  }

  if (!homeData.data) {
    return (
      <div className="flex min-h-svh flex-col bg-background pb-24">
        <HomeHeader
          userName={userName}
          greeting="Seu próximo passo começa aqui"
          imageSrc="/home-banner.jpg"
        />
        <div className="mx-auto grid w-full max-w-6xl animate-slide-up gap-6 px-5 pt-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <NoPlanCard />
          <CoachCard />
        </div>
        <BottomNav activePage="home" />
      </div>
    );
  }

  const { todayWorkoutDay, workoutStreak, consistencyByDay } = homeData.data;

  const [plansResponse, statsResponse] = await Promise.all([
    getWorkoutPlans({ active: "true" }),
    getStats({
      from: today.subtract(2, "month").startOf("month").format("YYYY-MM-DD"),
      to: today.endOf("month").format("YYYY-MM-DD"),
    }),
  ]);

  const activePlan = plansResponse.status === 200 ? plansResponse.data?.[0] : undefined;
  const workoutDays = activePlan?.workoutDays ?? [];
  const stats = statsResponse.status === 200 ? statsResponse.data : null;

  const todayHasStarted =
    consistencyByDay[today.format("YYYY-MM-DD")]?.workoutDayStarted ?? false;

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <HomeHeader userName={userName} imageSrc="/home-banner.jpg" />

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 pt-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex animate-slide-up flex-col gap-6">
          {todayWorkoutDay.isRest ? (
            <RestDayTodayCard />
          ) : (
            <TodayWorkoutHero
              workoutPlanId={todayWorkoutDay.workoutPlanId}
              dayId={todayWorkoutDay.id}
              name={todayWorkoutDay.name}
              weekDay={todayWorkoutDay.weekDay}
              estimatedDurationInSeconds={
                todayWorkoutDay.estimatedDurationInSeconds
              }
              exercisesCount={todayWorkoutDay.exercisesCount}
              coverImageUrl={todayWorkoutDay.coverImageUrl}
              hasStarted={todayHasStarted}
            />
          )}

          {workoutDays.length > 0 && (
            <WeekOverview
              workoutDays={workoutDays}
              consistencyByDay={consistencyByDay}
              today={today}
            />
          )}
        </div>

        <aside className="flex flex-col gap-6">
          <div className="animate-slide-up [animation-delay:80ms]">
            <ProgressSummary
              workoutStreak={workoutStreak}
              completedWorkoutsCount={stats?.completedWorkoutsCount}
              conclusionRate={stats?.conclusionRate}
            />
          </div>

          {activePlan && (
            <div className="flex animate-slide-up flex-col gap-3 [animation-delay:160ms]">
              <SectionHeader
                title="Próximos treinos"
                actionLabel="Ver plano"
                actionHref={`/workout-plans/${activePlan.id}`}
              />
              <NextWorkouts
                workoutPlanId={activePlan.id}
                workoutDays={workoutDays}
                today={today}
              />
            </div>
          )}

          <div className="animate-slide-up [animation-delay:240ms]">
            <CoachCard />
          </div>
        </aside>
      </div>

      <BottomNav
        activePage="home"
        activeWorkoutPlanId={homeData.data.activeWorkoutPlanId}
      />
    </div>
  );
}
