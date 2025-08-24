import BinaryClock from "@components/clock/BinaryClock";

export default function Page() {
  return (
    <main className="min-h-screen w-full bg-slate-900 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Binary Time
            </h1>
            <p className="text-slate-400">
              A minimalist LED-style binary clock (BCD mode).
            </p>
          </div>
        </header>

        <BinaryClock />
      </div>
    </main>
  );
}
