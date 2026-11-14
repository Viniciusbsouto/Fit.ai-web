import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <Skeleton className="h-[296px] w-full rounded-b-[20px]" />

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 pt-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-[280px] w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>

        <div className="flex flex-col gap-6">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-44 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
