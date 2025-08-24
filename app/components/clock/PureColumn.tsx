import { toBits } from "@utils/bits";
import Dot from "@components/clock/Dot";

type Props = {
  value: number; // whole unit value (e.g., 0–59)
  label: string; // H / M / S
  bits: number; // number of rows
  showLabel: boolean;
  weights?: number[]; // optional row weights, top→bottom
  color?: string;
};

export default function PureColumn({
  value,
  label,
  bits,
  showLabel,
  weights,
  color = "#22d3ee",
}: Props) {
  const arr = toBits(value, bits);
  const ws =
    weights && weights.length === bits
      ? weights
      : Array.from({ length: bits }, (_, i) => 2 ** (bits - 1 - i));

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col justify-end gap-2">
        {arr.map((b, i) => (
          <div key={i} className="flex items-center gap-2">
            <Dot on={!!b} title={`${label} ${ws[i]}`} color={color} />
            <span className="text-xs tabular-nums text-slate-400 select-none w-10 text-right">
              {ws[i]}
            </span>
          </div>
        ))}
      </div>
      {showLabel && (
        <div className="text-xs uppercase tracking-wide text-slate-300/90">
          {label}
        </div>
      )}
    </div>
  );
}
