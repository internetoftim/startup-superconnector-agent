import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  role: "agent" | "user";
  children: ReactNode;
}

function MiniOrb() {
  return (
    <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10">
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-md" />
      <span className="relative text-xs text-primary">◆</span>
    </div>
  );
}

export function ChatBubble({ role, children }: Props) {
  const isAgent = role === "agent";
  return (
    <div
      className={cn(
        "flex w-full animate-fade-in items-end gap-2",
        isAgent ? "justify-start" : "justify-end",
      )}
    >
      {isAgent && <MiniOrb />}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isAgent
            ? "rounded-tl-sm border border-border/60 bg-card/60 text-foreground backdrop-blur-md"
            : "rounded-tr-sm bg-primary text-primary-foreground",
        )}
      >
        {children}
      </div>
    </div>
  );
}
