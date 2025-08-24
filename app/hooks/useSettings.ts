import { useEffect, useState } from "react";

export type Mode = "BCD" | "PURE";

export type Settings = {
  is24h: boolean;
  showSeconds: boolean;
  showLabels: boolean;
  mode: Mode;
  ledColor: string;
};

const KEY = "binary-clock:settings:v1";

const defaults: Settings = {
  is24h: true,
  showSeconds: true,
  showLabels: true,
  mode: "BCD",
  ledColor: "#22d3ee", // cyan-400
};

function safeParse(raw: string | null): Partial<Settings> {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Partial<Settings>;
  } catch {
    return {};
  }
}

/**
 * Persisted UI settings for the binary clock, backed by localStorage.
 * Returns current values plus a generic `set` updater, `reset`, and `hydrated`.
 */
export default function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount
  useEffect(() => {
    const fromStorage = safeParse(
      typeof window !== "undefined" ? localStorage.getItem(KEY) : null
    );
    setSettings({ ...defaults, ...fromStorage });
    setHydrated(true);
  }, []);

  // Save whenever settings change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      /* ignore quota errors */
    }
  }, [settings, hydrated]);

  // Generic key-based setter (supports value or updater fn)
  function set<K extends keyof Settings>(
    key: K,
    value: Settings[K] | ((prev: Settings[K]) => Settings[K])
  ) {
    setSettings((prev) => ({
      ...prev,
      [key]:
        typeof value === "function"
          ? (value as (p: Settings[K]) => Settings[K])(prev[key])
          : value,
    }));
  }

  function reset() {
    setSettings(defaults);
  }

  return { ...settings, set, reset, hydrated };
}
