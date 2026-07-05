import { useState } from "react";
import { X, Check } from "lucide-react";

type Props = { open: boolean; onClose: () => void };

export function GuidePanel({ open, onClose }: Props) {
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!note.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setNote("");
      onClose();
    }, 1400);
  }

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-border/60 bg-card/95 p-6 shadow-2xl backdrop-blur transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Guide your agent</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Leave a steering note. Your agent will factor it into future conversations.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. focus more on our enterprise traction and less on the community angle"
          rows={6}
          className="mt-5 w-full rounded-xl border border-border/60 bg-background/60 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />

        <button
          onClick={handleSend}
          disabled={!note.trim() || sent}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {sent ? (
            <>
              <Check className="h-4 w-4" /> Guidance sent
            </>
          ) : (
            "Send guidance"
          )}
        </button>
      </div>
    </>
  );
}
