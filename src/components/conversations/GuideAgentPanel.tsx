import { useState } from "react";
import { X, Send, Check } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  agentName: string;
};

export function GuideAgentPanel({ open, onClose, agentName }: Props) {
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const send = () => {
    if (!note.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setNote("");
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-2xl border border-white/10 bg-card p-5 sm:rounded-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">Guide your agent</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Send a private steering note. It'll shape how your agent speaks with {agentName}.
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-muted-foreground hover:bg-white/5">
            <X className="h-4 w-4" />
          </button>
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder='e.g. "de-emphasize revenue, emphasize the team"'
          rows={4}
          className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none"
        />

        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Emphasize team", "De-emphasize revenue", "Ask about check size", "Slow down"].map((s) => (
            <button
              key={s}
              onClick={() => setNote((n) => (n ? n + " " + s : s))}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-foreground/70 hover:bg-white/[0.06]"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          {sent ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-medium text-emerald-300">
              <Check className="h-3.5 w-3.5" /> Guidance sent
            </span>
          ) : (
            <button
              onClick={send}
              disabled={!note.trim()}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" /> Send to agent
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
