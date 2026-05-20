"use client";

import { motion } from "framer-motion";
import { User, Sparkles, Brain, Wrench, CornerDownRight, TriangleAlert } from "lucide-react";
import type { Step } from "@/lib/types";
import { prettyJSON } from "@/lib/parse";

interface Props {
  step: Step;
  active: boolean;
  last: boolean;
}

const META: Record<
  Step["kind"],
  { label: string; color: string; icon: React.ReactNode }
> = {
  user: { label: "User", color: "var(--user)", icon: <User size={13} /> },
  assistant: { label: "Claude", color: "var(--assistant)", icon: <Sparkles size={13} /> },
  thinking: { label: "Thinking", color: "var(--think)", icon: <Brain size={13} /> },
  tool_call: { label: "Tool call", color: "var(--tool)", icon: <Wrench size={13} /> },
  tool_result: { label: "Result", color: "var(--result)", icon: <CornerDownRight size={13} /> },
};

export function StepCard({ step, active, last }: Props) {
  const meta = META[step.kind];
  const color = step.kind === "tool_result" && step.isError ? "var(--danger)" : meta.color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="flex gap-3"
    >
      {/* Rail */}
      <div className="relative flex w-5 shrink-0 flex-col items-center">
        <span
          className="relative z-10 mt-1.5 h-3 w-3 rounded-full border-2"
          style={{
            borderColor: color,
            background: active ? color : "var(--bg)",
          }}
        />
        {!last && <span className="absolute top-4 bottom-0 w-px bg-border" />}
      </div>

      {/* Card */}
      <div
        className="mb-3 flex-1 rounded-xl border bg-bg-elev p-3 transition-colors"
        style={{
          borderColor: active ? color : "var(--border)",
          boxShadow: active ? `0 0 0 1px ${color}33` : "none",
        }}
      >
        <div className="mb-1.5 flex items-center gap-1.5">
          <span style={{ color }}>{meta.icon}</span>
          <span
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color }}
          >
            {meta.label}
          </span>
          {step.kind === "tool_call" && step.toolName && (
            <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-[11px] text-fg">
              {step.toolName}()
            </code>
          )}
          {step.kind === "tool_result" && (
            <>
              {step.toolName && (
                <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">
                  {step.toolName}
                </code>
              )}
              {step.isError && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-danger">
                  <TriangleAlert size={11} /> error
                </span>
              )}
            </>
          )}
        </div>

        {step.kind === "tool_call" ? (
          <pre className="overflow-x-auto rounded-lg bg-bg px-3 py-2 font-mono text-[12px] leading-relaxed text-fg-muted">
            {prettyJSON(step.toolInput ?? {})}
          </pre>
        ) : step.kind === "tool_result" ? (
          <pre
            className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-bg px-3 py-2 font-mono text-[12px] leading-relaxed"
            style={{ color: step.isError ? "var(--danger)" : "var(--fg-muted)" }}
          >
            {step.text}
          </pre>
        ) : (
          <p
            className={`whitespace-pre-wrap text-[13px] leading-relaxed ${
              step.kind === "thinking" ? "italic text-fg-muted" : "text-fg"
            }`}
          >
            {step.text}
          </p>
        )}
      </div>
    </motion.div>
  );
}
