"use client";
import { useEffect, useState } from "react";
import DigitColumn from "./DigitColumn";
import useNow from "@/hooks/useNow";
import { pad, splitDigits } from "@/utils/time";

export default function BinaryClock() {
  const [is24h, setIs24h] = useState(true);
  const [showSeconds, setShowSeconds] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const now = useNow();
  const tick = now.getSeconds();

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  const displayH = is24h ? h : h % 12 || 12;
  const [hT, hU] = splitDigits(displayH);
  const [mT, mU] = splitDigits(m);
  const [sT, sU] = splitDigits(s);

  const textTime = `${pad(displayH)}:${pad(m)}${
    showSeconds ? ":" + pad(s) : ""
  }${is24h ? "" : h < 12 ? " AM" : " PM"}`;

  // constraints for tens columns
  const hoursTensActive = 2; // 0-2
  const minutesTensActive = 3; // 0-5
  const secondsTensActive = 3; // 0-5

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "t") setIs24h((v) => !v);
      if (k === "s") setShowSeconds((v) => !v);
      if (k === "l") setShowLabels((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="rounded-3xl p-6 md:p-8 border border-slate-700/60 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setIs24h((v) => !v)}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700"
          title="Toggle 12/24h [T]"
        >
          {is24h ? "24-hour" : "12-hour"}
        </button>
        <button
          onClick={() => setShowSeconds((v) => !v)}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700"
          title="Toggle seconds [S]"
        >
          {showSeconds ? "Hide seconds" : "Show seconds"}
        </button>
        <button
          onClick={() => setShowLabels((v) => !v)}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700"
          title="Toggle labels [L]"
        >
          {showLabels ? "Hide labels" : "Show labels"}
        </button>
      </div>

      {/* Human-readable time */}
      <div className="flex items-baseline justify-between mb-6">
        <div className="font-mono text-3xl md:text-5xl tabular-nums tracking-tight">
          {textTime}
          <span
            className={`ml-2 inline-block h-2 w-2 rounded-full ${
              tick % 2 === 0
                ? "bg-cyan-400 shadow-[0_0_12px_rgba(0,200,255,0.9)]"
                : "bg-slate-600"
            }`}
            aria-hidden="true"
          />
        </div>
        <div className="hidden md:block text-slate-400 text-sm">
          Shortcuts: <kbd className="px-1 py-0.5 bg-slate-800 rounded">T</kbd>{" "}
          12/24h · <kbd className="px-1 py-0.5 bg-slate-800 rounded">S</kbd>{" "}
          seconds · <kbd className="px-1 py-0.5 bg-slate-800 rounded">L</kbd>{" "}
          labels
        </div>
      </div>

      {/* BCD grid */}
      <div
        className={`grid ${
          showSeconds ? "grid-cols-6" : "grid-cols-4"
        } gap-x-6 md:gap-x-8`}
      >
        <DigitColumn
          digit={hT}
          label="H"
          maxBits={4}
          activeBits={hoursTensActive}
          showLabel={showLabels}
        />
        <DigitColumn
          digit={hU}
          label="H"
          maxBits={4}
          activeBits={4}
          showLabel={showLabels}
        />
        <DigitColumn
          digit={mT}
          label="M"
          maxBits={4}
          activeBits={minutesTensActive}
          showLabel={showLabels}
        />
        <DigitColumn
          digit={mU}
          label="M"
          maxBits={4}
          activeBits={4}
          showLabel={showLabels}
        />
        {showSeconds && (
          <>
            <DigitColumn
              digit={sT}
              label="S"
              maxBits={4}
              activeBits={secondsTensActive}
              showLabel={showLabels}
            />
            <DigitColumn
              digit={sU}
              label="S"
              maxBits={4}
              activeBits={4}
              showLabel={showLabels}
            />
          </>
        )}
      </div>

      <div className="mt-6 text-xs text-slate-400">
        BCD: Columns are decimal digits (HH:MM:SS). Rows are weights 8,4,2,1. A
        lit dot means that weight is present for that digit.
      </div>
    </main>
  );
}
