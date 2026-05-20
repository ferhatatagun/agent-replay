"use client";

import { FileJson, Sparkles, CircleCheck, TriangleAlert } from "lucide-react";
import type { TraceStats } from "@/lib/types";

interface Props {
  text: string;
  onChange: (text: string) => void;
  onLoadSample: () => void;
  parseError: string | null;
  stats: TraceStats | null;
}

export function TraceInput({ text, onChange, onLoadSample, parseError, stats }: Props) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-1.5 text-fg-muted">
          <FileJson size={14} className="text-accent" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-fg-faint">
            Trace
          </span>
        </div>
        <button
          onClick={onLoadSample}
          className="flex items-center gap-1 rounded-md border border-border-strong px-2 py-1 text-xs text-fg-muted transition-colors hover:border-accent hover:text-fg"
        >
          <Sparkles size={12} /> Load sample
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        placeholder='Paste a Claude agent trace — the messages array from a tool-use conversation:

[
  { "role": "user", "content": "…" },
  { "role": "assistant", "content": [
      { "type": "tool_use", "id": "toolu_01",
        "name": "get_weather", "input": { "city": "Istanbul" } }
  ]},
  …
]'
        className="flex-1 resize-none bg-bg-elev px-4 py-3 font-mono text-[12px] leading-relaxed text-fg outline-none placeholder:text-fg-faint"
      />

      <div className="border-t border-border px-4 py-2.5">
        {parseError ? (
          <div className="flex items-start gap-1.5 text-xs text-danger">
            <TriangleAlert size={13} className="mt-0.5 shrink-0" />
            <span>{parseError}</span>
          </div>
        ) : stats ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-result">
              <CircleCheck size={13} className="shrink-0" />
              <span className="font-mono text-fg-muted">
                {stats.messages} messages · {stats.toolCalls} tool calls
                {stats.errors > 0 && (
                  <span className="text-danger"> · {stats.errors} error</span>
                )}
              </span>
            </div>
            {stats.tools.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {stats.tools.map((t) => (
                  <code
                    key={t}
                    className="rounded bg-bg px-1.5 py-0.5 font-mono text-[10px] text-tool"
                  >
                    {t}
                  </code>
                ))}
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-fg-faint">
            Paste a trace, or load the sample to see a replay.
          </span>
        )}
      </div>
    </div>
  );
}
