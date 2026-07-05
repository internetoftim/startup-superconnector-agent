interface Props {
  options: string[];
  onSelect: (value: string) => void;
}

export function QuickReplyChips({ options, onSelect }: Props) {
  return (
    <div className="flex flex-wrap justify-end gap-2 animate-fade-in">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className="rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
