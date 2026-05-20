import type {
  ContentBlock,
  ParseResult,
  RawMessage,
  Step,
  StepKind,
  ToolResultBlock,
} from "./types";

const EMPTY: ParseResult = {
  ok: false,
  steps: [],
  stats: { messages: 0, toolCalls: 0, tools: [], errors: 0 },
};

/**
 * Parse a pasted Claude agent trace into a flat timeline of steps.
 * Accepts either a bare `messages` array or a full request body `{ messages }`.
 */
export function parseTrace(rawText: string): ParseResult {
  const trimmed = rawText.trim();
  if (!trimmed) return { ...EMPTY, error: "Paste a trace to get started." };

  let json: unknown;
  try {
    json = JSON.parse(trimmed);
  } catch {
    return { ...EMPTY, error: "That isn't valid JSON. Check for a stray comma or quote." };
  }

  const messages = extractMessages(json);
  if (!messages) {
    return {
      ...EMPTY,
      error: "Expected an array of messages, or an object with a `messages` array.",
    };
  }
  if (messages.length === 0) {
    return { ...EMPTY, error: "The trace has no messages." };
  }

  const steps: Step[] = [];
  const toolNames = new Map<string, string>();
  let toolCalls = 0;
  let errors = 0;
  const toolSet = new Set<string>();

  // First pass: collect tool_use id → name so results can resolve their name.
  for (const msg of messages) {
    if (Array.isArray(msg.content)) {
      for (const block of msg.content) {
        if (isToolUse(block)) toolNames.set(block.id, block.name);
      }
    }
  }

  let i = 0;
  const push = (s: Omit<Step, "index">) => steps.push({ ...s, index: i++ });

  for (const msg of messages) {
    const role = msg.role === "assistant" ? "assistant" : "user";

    if (typeof msg.content === "string") {
      if (msg.content.trim()) push({ kind: role as StepKind, text: msg.content });
      continue;
    }
    if (!Array.isArray(msg.content)) continue;

    for (const block of msg.content) {
      if (!block || typeof block !== "object") continue;
      switch (block.type) {
        case "text":
          if (block.text?.trim()) push({ kind: role as StepKind, text: block.text });
          break;
        case "thinking":
          if (block.thinking?.trim()) push({ kind: "thinking", text: block.thinking });
          break;
        case "tool_use":
          toolCalls++;
          toolSet.add(block.name);
          push({
            kind: "tool_call",
            toolName: block.name,
            toolInput: block.input,
            toolUseId: block.id,
          });
          break;
        case "tool_result": {
          if (block.is_error) errors++;
          push({
            kind: "tool_result",
            toolName: toolNames.get(block.tool_use_id) ?? "tool",
            toolUseId: block.tool_use_id,
            text: renderResultContent(block),
            isError: Boolean(block.is_error),
          });
          break;
        }
      }
    }
  }

  if (steps.length === 0) {
    return { ...EMPTY, error: "No readable content found in the trace." };
  }

  return {
    ok: true,
    steps,
    stats: {
      messages: messages.length,
      toolCalls,
      tools: [...toolSet],
      errors,
    },
  };
}

function extractMessages(json: unknown): RawMessage[] | null {
  if (Array.isArray(json)) return json as RawMessage[];
  if (json && typeof json === "object" && Array.isArray((json as { messages?: unknown }).messages)) {
    return (json as { messages: RawMessage[] }).messages;
  }
  return null;
}

function isToolUse(b: ContentBlock): b is Extract<ContentBlock, { type: "tool_use" }> {
  return Boolean(b) && typeof b === "object" && b.type === "tool_use";
}

/** A tool_result's content can be a string, an array of text blocks, or arbitrary JSON. */
function renderResultContent(block: ToolResultBlock): string {
  const c = block.content;
  if (typeof c === "string") return c;
  if (Array.isArray(c)) {
    const text = c
      .map((b) => (b && typeof b === "object" && "text" in b ? String(b.text) : ""))
      .filter(Boolean)
      .join("\n");
    if (text) return text;
  }
  try {
    return JSON.stringify(c, null, 2);
  } catch {
    return String(c);
  }
}

export function prettyJSON(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
