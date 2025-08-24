import { hexToRGBA } from "@utils/color";

type Props = {
  on: boolean;
  title?: string;
  color?: string; // hex like #22d3ee
};

export default function Dot({ on, title, color = "#22d3ee" }: Props) {
  return (
    <div
      title={title}
      role="img"
      aria-label={`${title || ""} ${on ? "on" : "off"}`.trim()}
      className="h-6 w-6 rounded-full transition-all duration-200 border"
      style={
        on
          ? {
              backgroundColor: color,
              borderColor: hexToRGBA(color, 0.6),
              boxShadow: `0 0 12px ${hexToRGBA(color, 0.9)}`,
            }
          : {
              backgroundColor: "rgba(51,65,85,0.7)", // slate-700/70
              borderColor: "#475569", // slate-600
            }
      }
    />
  );
}
