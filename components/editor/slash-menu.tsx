'use client';

export default function SlashMenu({ items, command, selected }: any) {
  return (
    <div className="w-72 rounded-xl border border-border bg-card shadow-xl overflow-hidden">
      {items.map((item: any, index: number) => (
        <button
          key={item.title}
          onClick={() => command(item)}
          className={`w-full text-left px-3 py-2 ${
            index === selected
              ? 'bg-accent text-foreground'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <div className="text-sm font-medium">{item.title}</div>
          <div className="text-xs opacity-70">{item.description}</div>
        </button>
      ))}
    </div>
  );
}