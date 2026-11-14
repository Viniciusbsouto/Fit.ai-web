import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { getHomeData, getUserTrainData } from "@/app/_lib/api/fetch-generated";
import dayjs from "dayjs";
import { Chat } from "@/app/_components/chat";

export default async function OnboardingPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const [homeData, trainData] = await Promise.all([
    getHomeData(dayjs().format("YYYY-MM-DD")),
    getUserTrainData(),
  ]);

  if (homeData.status !== 200) {
    throw new Error("Failed to fetch home data");
  }

  if (trainData.status !== 200) {
    throw new Error("Failed to fetch user train data");
  }

  if (homeData.data && trainData.data) {
    redirect("/");
  }

  return (
    <Chat
      embedded
      initialMessage="Quero começar a melhorar minha saúde!"
      introduction={{
        title: "Vamos criar seu primeiro plano",
        description:
          "O Coach IA fará algumas perguntas sobre seus objetivos, sua rotina e sua experiência para personalizar seu treino.",
      }}
    />
  );
}
