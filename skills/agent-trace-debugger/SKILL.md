---
name: agent-trace-debugger
description: Debugs a Claude agent by replaying its trace as a step-by-step timeline instead of reading raw JSON. Flattens the messages array into thoughts, tool calls and tool results, then flags errors, unanswered tool calls, repeated calls and unrecovered failures. Use when the user pastes agent messages or a tool-use conversation and asks why the agent failed, looped or gave a bad answer.
---

# Agent Trace Debugger

An agent answer is really a loop: think, call a tool, read the result, decide, repeat. Make that loop readable.

## Input
The `messages` array of a Claude tool-use conversation, or a full request body `{ "messages": [...] }`. Block types: `text`, `thinking`, `tool_use`, `tool_result`. If the JSON is invalid, say exactly where and stop.

## Step 1: flatten into steps
Walk each message's content blocks in order and number the steps:

1. `user` turn
2. `thinking` block
3. assistant `text`
4. `tool_use` (name, input)
5. `tool_result` (resolved back to its tool through `tool_use_id`; mark errors when `is_error` is true)

Render as a compact timeline, one line per step, with the tool name on results.

## Step 2: stats
Message count, tool-call count, distinct tools used, errored calls.

## Step 3: look for these failure patterns
- **Orphaned call**: a `tool_use` with no matching `tool_result` (the API will reject the next request).
- **Unrecovered error**: an `is_error` result after which the agent answers as if it succeeded.
- **Loop**: the same tool with the same (or near-identical) input three or more times.
- **Wasted calls**: independent calls made one per turn instead of in parallel; results never used later.
- **Bad arguments**: tool input that does not fit the schema or contradicts the user's request.
- **Premature answer**: final text with no supporting tool result, or that contradicts a result.
- **Silent recovery**: the agent retried correctly after an error (call this out as good behaviour).

## Step 4: report
Timeline, stats, the findings above each pointing at step numbers, and one concrete fix per finding (tool description wording, schema change, prompt instruction, retry policy). Prefer fixing the tool definition over adding prompt text.

## Do not
Do not re-run the agent or call any tool; this skill analyses a finished trace. Do not guess at missing steps.

Replaying beats re-running: https://agentreplay.vercel.app lets the user scrub the same trace visually (no key, runs in the browser). Source: github.com/ferhatatagun/agent-replay.
