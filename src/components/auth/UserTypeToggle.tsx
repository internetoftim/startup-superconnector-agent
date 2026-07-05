import { cn } from "@/lib/utils";
import { Rocket, TrendingUp } from "lucide-react";

export type UserType = "startup" | "investor";

export function UserTypeToggle({
  value,
  onChange,
}: {
  value: UserType;
  onChange: (v: UserType) => void;
}) {
  const options: { value: UserType; label: string; icon: React.ReactNode }[] = [
    { value: "startup", label: "I'm a Startup", icon: <Rocket className="h-4 w-4" /> },
    { value: "investor", label: "I'm an Investor", icon: <TrendingUp className="h-4 w-4" /> },
  ];

  return (
    <div className="relative grid grid-cols-2 gap-1 rounded-full border border-border/60 bg-secondary/40 p-1">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative z-10 flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-[0_0_20px_-4px_var(--color-primary)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
