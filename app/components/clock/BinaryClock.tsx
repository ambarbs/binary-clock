"use client";

import { useEffect, useState } from "react";
import DigitColumn from "@components/clock/DigitColumn";
import PureColumn from "@components/clock/PureColumn";
import useNow from "@hooks/useNow";
import { pad, splitDigits } from "@utils/time";
import { hexToRGBA } from "@utils/color"; // ⬅️ import to derive glow colors

type Mode = "BCD" | "PURE";

export default function BinaryClock() {
  const [is24h, setIs24h] = useState(true);
  const [showSeconds, setShowSeconds] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [mode, setMode] = useState<Mode>("BCD");
  const [ledColor, setLedColor] = useState("#22d3ee"); // cyan-400

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

  // BCD constraints (tens columns)
  const hoursTensActive = 2; // 0–2
  const minutesTensActive = 3; // 0–5
  const secondsTensActive = 3; // 0–5

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "t") setIs24h((v) => !v);
      if (k === "s") setShowSeconds((v) => !v);
      if (k === "l") setShowLabels((v) => !v);
      if (k === "b") setMode((v) => (v === "BCD" ? "PURE" : "BCD"));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const presets = ["#22d3ee", "#f43f5e", "#34d399", "#a78bfa", "#f59e0b"]; // cyan, rose, emerald, violet, amber

  // ---- Pulsing frame glow (per second) ----
  const frameBorder = hexToRGBA(ledColor, 0.55);
  const weakGlow = `0 0 10px ${hexToRGBA(ledColor, 0.22)}, 0 0 26px ${hexToRGBA(
    ledColor,
    0.28
  )}`;
  const strongGlow = `0 0 18px ${hexToRGBA(
    ledColor,
    0.5
  )}, 0 0 48px ${hexToRGBA(ledColor, 0.7)}`;
  const pulseOn = tick % 2 === 0; // toggle once per second

  return (
    <main
      className="rounded-3xl p-6 md:p-8 border bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur"
      style={{
        borderColor: frameBorder,
        boxShadow: pulseOn ? strongGlow : weakGlow,
        transition: "box-shadow 520ms ease-in-out, border-color 160ms linear",
      }}
    >
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
        <button
          onClick={() => setMode((v) => (v === "BCD" ? "PURE" : "BCD"))}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700"
          title="Toggle BCD/Pure [B]"
        >
          Mode: {mode}
        </button>

        {/* LED colour picker */}
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm text-slate-400">LED</label>
          <input
            type="color"
            value={ledColor}
            onChange={(e) => setLedColor(e.target.value)}
            className="h-9 w-12 cursor-pointer rounded-lg border border-slate-700 bg-slate-800"
            title="Pick LED colour"
          />
          <div className="flex items-center gap-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setLedColor(p)}
                className="h-6 w-6 rounded-full border border-slate-700"
                style={{ backgroundColor: p }}
                title={p}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Human-readable time */}
      <div className="flex items-baseline justify-between mb-6">
        <div className="font-mono text-3xl md:text-5xl tabular-nums tracking-tight">
          {textTime}
          <span
            className="ml-2 inline-block h-2 w-2 rounded-full"
            style={{
              backgroundColor: tick % 2 === 0 ? ledColor : "#475569",
              boxShadow:
                tick % 2 === 0
                  ? `0 0 12px ${hexToRGBA(ledColor, 0.9)}`
                  : undefined,
            }}
            aria-hidden="true"
          />
        </div>
        <div className="hidden md:block text-slate-400 text-sm">
          Shortcuts: <kbd className="px-1 py-0.5 bg-slate-800 rounded">T</kbd>{" "}
          12/24h · <kbd className="px-1 py-0.5 bg-slate-800 rounded">S</kbd>{" "}
          seconds · <kbd className="px-1 py-0.5 bg-slate-800 rounded">L</kbd>{" "}
          labels · <kbd className="px-1 py-0.5 bg-slate-800 rounded">B</kbd>{" "}
          mode
        </div>
      </div>

      {mode === "BCD" ? (
        <>
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
              color={ledColor}
            />
            <DigitColumn
              digit={hU}
              label="H"
              maxBits={4}
              activeBits={4}
              showLabel={showLabels}
              color={ledColor}
            />
            <DigitColumn
              digit={mT}
              label="M"
              maxBits={4}
              activeBits={minutesTensActive}
              showLabel={showLabels}
              color={ledColor}
            />
            <DigitColumn
              digit={mU}
              label="M"
              maxBits={4}
              activeBits={4}
              showLabel={showLabels}
              color={ledColor}
            />
            {showSeconds && (
              <>
                <DigitColumn
                  digit={sT}
                  label="S"
                  maxBits={4}
                  activeBits={secondsTensActive}
                  showLabel={showLabels}
                  color={ledColor}
                />
                <DigitColumn
                  digit={sU}
                  label="S"
                  maxBits={4}
                  activeBits={4}
                  showLabel={showLabels}
                  color={ledColor}
                />
              </>
            )}
          </div>
          <div className="mt-6 text-xs text-slate-400">
            BCD: Columns are decimal digits (HH:MM:SS). Rows are weights
            8,4,2,1.
          </div>
        </>
      ) : (
        <>
          {/* PURE grid: one column per unit */}
          <div
            className={`grid ${
              showSeconds ? "grid-cols-3" : "grid-cols-2"
            } gap-x-10 md:gap-x-14`}
          >
            <PureColumn
              value={displayH}
              label="H"
              bits={is24h ? 5 : 4}
              showLabel={showLabels}
              weights={is24h ? [16, 8, 4, 2, 1] : [8, 4, 2, 1]}
              color={ledColor}
            />
            <PureColumn
              value={m}
              label="M"
              bits={6}
              showLabel={showLabels}
              weights={[32, 16, 8, 4, 2, 1]}
              color={ledColor}
            />
            {showSeconds && (
              <PureColumn
                value={s}
                label="S"
                bits={6}
                showLabel={showLabels}
                weights={[32, 16, 8, 4, 2, 1]}
                color={ledColor}
              />
            )}
          </div>
          <div className="mt-6 text-xs text-slate-400">
            PURE: Each unit is a single binary column; rows are powers of two
            (top→bottom).
          </div>
        </>
      )}
    </main>
  );
}
