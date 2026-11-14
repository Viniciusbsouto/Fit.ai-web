import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
}

export function SectionHeader({
  title,
  actionLabel,
  actionHref,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-heading text-lg font-semibold text-foreground">
        {title}
      </h2>
      {actionLabel && actionHref && (
        <Button variant="link" size="sm" className="h-auto p-0" asChild>
          <Link href={actionHref} className="font-heading text-xs text-primary">
            {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}
