import Image from "next/image";

interface HomeHeaderProps {
  userName: string;
  greeting?: string;
  imageSrc?: string;
}

export function HomeHeader({
  userName,
  greeting = "Bora treinar hoje?",
  imageSrc = "/home-banner.jpg",
}: HomeHeaderProps) {
  return (
    <div className="relative flex h-[296px] shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-[20px] px-5 pb-10 pt-5">
      <div className="absolute inset-0" aria-hidden="true">
        <Image src={imageSrc} alt="" fill className="object-cover" priority />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(243deg, rgba(0,0,0,0) 34%, rgb(0,0,0) 100%)",
          }}
        />
      </div>

      <p
        className="relative text-[22px] uppercase leading-[1.15] text-background"
        style={{ fontFamily: "var(--font-anton)" }}
      >
        Fit.ai
      </p>

      <div className="relative flex w-full items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-heading text-2xl font-semibold leading-[1.05] text-background">
            Olá, {userName}
          </h1>
          <p className="font-heading text-sm leading-[1.15] text-background/70">
            {greeting}
          </p>
        </div>
      </div>
    </div>
  );
}
