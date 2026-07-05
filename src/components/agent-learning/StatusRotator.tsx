import { useEffect, useState } from "react";

const STATUSES = [
  "Reading your recent posts...",
  "Identifying your areas of interest...",
  "Analyzing your professional network...",
  "Extracting your investment thesis...",
  "Mapping your connections...",
  "Assembling your AI agent...",
];

export function StatusRotator() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % STATUSES.length);
        setVisible(true);
      }, 250);
    }, 1700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-6 text-center" aria-live="polite">
      <p
        className={`text-sm font-medium text-foreground/90 transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
        }`}
      >
        {STATUSES[index]}
      </p>
    </div>
  );
}
