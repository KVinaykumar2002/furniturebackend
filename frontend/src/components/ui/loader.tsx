import "./loader.css";
import { cn } from "@/lib/utils";

type LoaderVariant = "spinner" | "dots";

interface LoaderProps {
  /** "spinner" = thin ring (default), "dots" = three pulsing dots */
  variant?: LoaderVariant;
  /** Optional label below the loader */
  label?: string;
  /** Size: sm (inline), md (default), lg (page-level) */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "loader-size-sm",
  md: "loader-size-md",
  lg: "loader-size-lg",
};

export function Loader({ variant = "spinner", label, size = "md", className }: LoaderProps) {
  const sizeClass = sizeClasses[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-muted-foreground",
        className
      )}
      role="status"
      aria-label={label ?? "Loading"}
    >
      {variant === "spinner" && (
        <div
          className={cn("relative flex shrink-0 text-foreground/80", sizeClass)}
          style={{
            animation: "loader-spin 0.9s cubic-bezier(0.5, 0, 0.5, 1) infinite",
          }}
        >
          <svg
            className="size-full block"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            {/* Faint static ring */}
            <circle
              cx="20"
              cy="20"
              r="17"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="60 90"
              strokeDashoffset="0"
              className="loader-pulse opacity-40"
            />
            {/* Rotating arc — whole wrapper spins so arc is visible */}
            <circle
              cx="20"
              cy="20"
              r="17"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="28 122"
              strokeDashoffset="0"
              opacity={0.95}
            />
          </svg>
        </div>
      )}
      {variant === "dots" && (
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="loader-dot h-2 w-2 rounded-full bg-current"
              style={{
                animation: "loader-dot 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>
      )}
      {label && (
        <span className="text-sm font-medium tabular-nums tracking-wide">{label}</span>
      )}
    </div>
  );
}

/** Full section loading state: centered, with comfortable padding */
export function LoadingSection({
  label = "Loading…",
  variant = "spinner",
  size = "lg",
  className,
}: {
  label?: string;
  variant?: LoaderVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[200px] items-center justify-center py-12 md:py-16",
        className
      )}
    >
      <Loader variant={variant} label={label} size={size} />
    </div>
  );
}
