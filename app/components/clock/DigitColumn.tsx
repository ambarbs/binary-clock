import Dot from "./Dot";
import { toBits } from "@/utils/bits";

type Props = {
  digit: number;
  label: string;
  maxBits?: number; // usually 4
  activeBits?: number; // e.g. tens-of-hours uses 2 bits
  showLabel: boolean;
};

export default function DigitColumn({
  digit,
  label,
  maxBits = 4,
  activeBits = 4,
  showLabel,
}: Props) {
  const bits = toBits(digit, maxBits);
  const weights = [8, 4, 2, 1].slice(4 - maxBits);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col justify-end gap-2">
        {bits.map((b, i) => {
          const isActiveRow = i >= maxBits - activeBits; // gray out rows above allowed range
          const w = weights[i] ?? 0;
          return (
            <div
              key={i}
              className={`flex items-center gap-2 ${
                isActiveRow ? "opacity-100" : "opacity-40"
              }`}
            >
              <Dot on={isActiveRow && !!b} title={`${label} ${w}`} />
              <span className="text-xs tabular-nums text-slate-400 select-none w-6 text-right">
                {w}
              </span>
            </div>
          );
        })}
      </div>
      {showLabel && (
        <div className="text-xs uppercase tracking-wide text-slate-300/90">
          {label}
        </div>
      )}
    </div>
  );
}
