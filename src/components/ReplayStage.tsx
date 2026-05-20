"use client";

import { useEffect, useRef } from "react";
import { Clapperboard } from "lucide-react";
import { Controls } from "./Controls";
import { StepCard } from "./StepCard";
import type { Step } from "@/lib/types";

interface Props {
  steps: Step[];
  cursor: number;
  playing: boolean;
  speed: number;
  onTogglePlay: () => void;
  onStep: (dir: -1 | 1) => void;
  onRestart: () => void;
  onSeek: (cursor: number) => void;
  onSpeed: (s: number) => void;
}

export function ReplayStage({
  steps,
  cursor,
  playing,
  speed,
  onTogglePlay,
  onStep,
  onRestart,
  onSeek,
  onSpeed,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Follow the newest step — but not on the initial render, so the page
  // opens at the top of the trace rather than scrolled to the end.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [cursor]);

  const revealed = steps.slice(0, cursor);

  return (
    <div className="flex h-full flex-col">
      <Controls
        playing={playing}
        cursor={cursor}
        total={steps.length}
        speed={speed}
        onTogglePlay={onTogglePlay}
        onStep={onStep}
        onRestart={onRestart}
        onSeek={onSeek}
        onSpeed={onSpeed}
      />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5">
        {steps.length === 0 ? (
          <EmptyStage />
        ) : revealed.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-sm text-fg-faint">
              Press <span className="font-medium text-accent">play</span> to replay{" "}
              {steps.length} steps.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl">
            {revealed.map((step, idx) => (
              <StepCard
                key={step.index}
                step={step}
                active={idx === revealed.length - 1}
                last={idx === revealed.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyStage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <Clapperboard size={28} className="mb-3 text-fg-faint" />
      <p className="max-w-[18rem] text-sm text-fg-faint">
        Paste a Claude agent trace on the left, or load the sample, and the
        tool-calling loop replays here.
      </p>
    </div>
  );
}
