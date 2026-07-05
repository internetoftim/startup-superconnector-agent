import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SocialLoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  emphasized?: boolean;
}

export function SocialLoginButton({
  icon,
  label,
  emphasized,
  className,
  ...props
}: SocialLoginButtonProps) {
  return (
    <Button
      variant="outline"
      size="lg"
      className={cn(
        "w-full justify-start gap-3 border-border/60 bg-secondary/40 text-foreground hover:bg-secondary/70",
        emphasized &&
          "border-primary/40 bg-primary/10 hover:bg-primary/15 shadow-[0_0_0_1px_var(--color-primary)/20]",
        className,
      )}
      {...props}
    >
      <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
      <span className="flex-1 text-left font-medium">{label}</span>
      {emphasized && (
        <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
          Recommended
        </span>
      )}
    </Button>
  );
}
