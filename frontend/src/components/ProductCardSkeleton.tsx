import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <article className={cn("flex flex-col", className)}>
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="pt-3 pb-1 space-y-2">
        <Skeleton className="h-3.5 w-full max-w-[90%] rounded" />
        <Skeleton className="h-3.5 w-2/3 rounded" />
      </div>
    </article>
  );
}

/** Grid of product skeletons for list/grid loading state */
export function ProductGridSkeleton({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6",
        className
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
