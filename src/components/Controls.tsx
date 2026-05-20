"use client";

import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";

interface Props {
  playing: boolean;
  cursor: number; // count of revealed steps, 0..total
  total: number;
  speed: number;
  onTogglePlay: () => void;
  onStep: (dir: -1 | 1) => void;
  onRestart: () => void;
  onSeek: (cursor: number) => void;
  onSpeed: (s: number) => void;
}

const SPEEDS = [0.5, 1, 2];

export function Controls({
  playing,
  cursor,
  total,
  speed,
  onTogglePlay,
  onStep,
  onRestart,
  onSeek,
  onSpeed,
}: Props) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
      <div className="flex items-center gap-1">
        <IconButton label="Restart" onClick={onRestart}>
          <RotateCcw size={15} />
        </IconButton>
        <IconButton label="Step back" onClick={() => onStep(-1)} disabled={cursor <= 0}>
          <SkipBack size={15} />
        </IconButton>
        <button
          onClick={onTogglePlay}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-black transition-opacity hover:opacity-90"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>
        <IconButton label="Step forward" onClick={() => onStep(1)} disabled={cursor >= total}>
          <SkipForward size={15} />
        </IconButton>
      </div>

      {/* Scrubber */}
      <input
        type="range"
        min={0}
        max={total}
        value={cursor}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="h-1 flex-1 cursor-pointer accent-[var(--accent)]"
        aria-label="Timeline position"
      />

      <span className="shrink-0 font-mono text-xs text-fg-muted tabular-nums">
        {cursor} / {total}
      </span>

      <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-border-strong p-0.5">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => onSpeed(s)}
            className={`rounded px-1.5 py-0.5 font-mono text-[11px] transition-colors ${
              speed === s ? "bg-bg-elev-2 text-fg" : "text-fg-faint hover:text-fg-muted"
            }`}
          >
            {s}×
          </button>
        ))}
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong text-fg-muted transition-colors hover:text-fg disabled:opacity-30 disabled:hover:text-fg-muted"
    >
      {children}
    </button>
  );
}
