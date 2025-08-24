type Props = {
  on: boolean;
  title?: string;
};

export default function Dot({ on, title }: Props) {
  return (
    <div
      title={title}
      role="img"
      aria-label={`${title || ""} ${on ? "on" : "off"}`.trim()}
      className={[
        "h-6 w-6 rounded-full transition-all duration-200",
        on
          ? "shadow-[0_0_12px_rgba(0,200,255,0.9)] bg-cyan-400/90 ring-2 ring-cyan-200"
          : "bg-slate-700/70 ring-1 ring-slate-600",
      ].join(" ")}
    />
  );
}
