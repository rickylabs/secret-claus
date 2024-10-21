import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-red-900/10 dark:bg-red-900/10",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton }
