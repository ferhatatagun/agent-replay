"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Logo, GithubMark } from "@/components/Logo";
import { TraceInput } from "@/components/TraceInput";
import { ReplayStage } from "@/components/ReplayStage";
import { parseTrace } from "@/lib/parse";
import { SAMPLE_JSON } from "@/lib/sample";

const BASE_INTERVAL = 1100; // ms per step at 1×

export default function Home() {
  const [text, setText] = useState(SAMPLE_JSON);
  // Open with the full timeline already laid out; Play replays it from the top.
  const [cursor, setCursor] = useState(() => parseTrace(SAMPLE_JSON).steps.length);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const parsed = useMemo(() => parseTrace(text), [text]);
  const steps = parsed.steps;
  const total = steps.length;

  // Keep the cursor within range when the trace changes.
  useEffect(() => {
    setCursor((c) => Math.min(c, total));
  }, [total]);

  // Deep link: ?step=N opens with exactly N steps revealed.
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("step");
    if (raw === null) return;
    const n = Number.parseInt(raw, 10);
    if (!Number.isNaN(n)) setCursor(Math.max(0, Math.min(total, n)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Playback ticker: schedule the next reveal whenever we advance.
  useEffect(() => {
    if (!playing) return;
    if (cursor >= total) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => {
      setCursor((c) => Math.min(c + 1, total));
    }, BASE_INTERVAL / speed);
    return () => clearTimeout(t);
  }, [playing, cursor, total, speed]);

  const togglePlay = useCallback(() => {
    if (total === 0) return;
    if (cursor >= total) {
      setCursor(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  }, [cursor, total]);

  const step = useCallback(
    (dir: -1 | 1) => {
      setPlaying(false);
      setCursor((c) => Math.max(0, Math.min(total, c + dir)));
    },
    [total],
  );

  const restart = useCallback(() => {
    setPlaying(false);
    setCursor(0);
  }, []);

  const seek = useCallback((c: number) => {
    setPlaying(false);
    setCursor(c);
  }, []);

  const loadSample = useCallback(() => {
    setText(SAMPLE_JSON);
    setCursor(0);
    setPlaying(true);
  }, []);

  // Keyboard transport: space = play/pause, arrows = step.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, step]);

  return (
    <div className="flex h-screen flex-col bg-bg">
      <header className="flex shrink-0 items-center justify-between border-b border-border bg-bg-elev/80 px-4 py-2.5 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <Logo size={26} />
          <div className="leading-tight">
            <h1 className="text-sm font-semibold tracking-tight">agent-replay</h1>
            <p className="hidden text-[11px] text-fg-faint sm:block">
              watch a Claude agent&apos;s tool-calling loop
            </p>
          </div>
        </div>
        <a
          href="https://github.com/ferhatatagun/agent-replay"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-border-strong px-2.5 py-1.5 text-xs text-fg-muted transition-colors hover:text-fg"
        >
          <GithubMark size={14} />
          <span className="hidden sm:inline">Source</span>
        </a>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(320px,380px)_1fr]">
        <section className="min-h-0 border-b border-border bg-bg-elev lg:border-b-0 lg:border-r">
          <TraceInput
            text={text}
            onChange={setText}
            onLoadSample={loadSample}
            parseError={parsed.ok ? null : (parsed.error ?? null)}
            stats={parsed.ok ? parsed.stats : null}
          />
        </section>

        <section className="min-h-0 bg-bg-elev-2">
          <ReplayStage
            steps={steps}
            cursor={cursor}
            playing={playing}
            speed={speed}
            onTogglePlay={togglePlay}
            onStep={step}
            onRestart={restart}
            onSeek={seek}
            onSpeed={setSpeed}
          />
        </section>
      </main>
    </div>
  );
}
