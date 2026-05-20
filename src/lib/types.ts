export type Role = "user" | "assistant";

/** Raw Anthropic Messages API content blocks (the input we parse). */
export interface TextBlock {
  type: "text";
  text: string;
}
export interface ThinkingBlock {
  type: "thinking";
  thinking: string;
}
export interface ToolUseBlock {
  type: "tool_use";
  id: string;
  name: string;
  input: unknown;
}
export interface ToolResultBlock {
  type: "tool_result";
  tool_use_id: string;
  content: unknown;
  is_error?: boolean;
}
export type ContentBlock = TextBlock | ThinkingBlock | ToolUseBlock | ToolResultBlock;

export interface RawMessage {
  role: Role;
  content: string | ContentBlock[];
}

/** A flattened timeline step — one visual unit in the replay. */
export type StepKind = "user" | "assistant" | "thinking" | "tool_call" | "tool_result";

export interface Step {
  index: number;
  kind: StepKind;
  /** text body for user / assistant / thinking, or the rendered result body */
  text?: string;
  /** tool name for tool_call, or the resolved name for a tool_result */
  toolName?: string;
  /** input object for a tool_call */
  toolInput?: unknown;
  toolUseId?: string;
  /** true when a tool_result is flagged as an error */
  isError?: boolean;
}

export interface TraceStats {
  messages: number;
  toolCalls: number;
  tools: string[];
  errors: number;
}

export interface ParseResult {
  ok: boolean;
  steps: Step[];
  stats: TraceStats;
  error?: string;
}
