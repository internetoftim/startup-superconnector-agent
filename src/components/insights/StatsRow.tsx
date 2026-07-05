type Props = {
  label: string;
  value: string | number;
};

export function StatsRow({ stats }: { stats: Props[] }) {
  return (
    <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-border py-6 sm:grid-cols-3 md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label}>
          <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {s.label}
          </dt>
          <dd className="mt-2 font-serif text-3xl leading-none text-foreground">
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
