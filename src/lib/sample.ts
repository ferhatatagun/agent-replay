import type { RawMessage } from "./types";

/**
 * A representative Claude agent trace: a multi-tool loop with a thinking
 * block and a tool that fails — so the replay shows a real agent recovering.
 */
export const SAMPLE_TRACE: RawMessage[] = [
  {
    role: "user",
    content:
      "I'm in Istanbul and want to go for a run this afternoon. Is that a good idea, and when should I head out?",
  },
  {
    role: "assistant",
    content: [
      {
        type: "thinking",
        thinking:
          "Before recommending a time I should check three things: the weather, the air quality, and whether the user is actually free this afternoon. I'll call the tools one at a time and reason about each result.",
      },
      { type: "text", text: "Good question — let me check a few things for you." },
      {
        type: "tool_use",
        id: "toolu_01",
        name: "get_weather",
        input: { city: "Istanbul", when: "today" },
      },
    ],
  },
  {
    role: "user",
    content: [
      {
        type: "tool_result",
        tool_use_id: "toolu_01",
        content: "22°C, clear skies, wind 12 km/h, sunset 19:48.",
      },
    ],
  },
  {
    role: "assistant",
    content: [
      { type: "text", text: "Weather looks ideal. Now checking the air quality." },
      {
        type: "tool_use",
        id: "toolu_02",
        name: "get_air_quality",
        input: { city: "Istanbul" },
      },
    ],
  },
  {
    role: "user",
    content: [
      {
        type: "tool_result",
        tool_use_id: "toolu_02",
        content: "AirQuality API timed out after 5000ms.",
        is_error: true,
      },
    ],
  },
  {
    role: "assistant",
    content: [
      {
        type: "text",
        text: "The air quality service is down — I'll note that and proceed without it.",
      },
      {
        type: "tool_use",
        id: "toolu_03",
        name: "get_calendar",
        input: { date: "today", part: "afternoon" },
      },
    ],
  },
  {
    role: "user",
    content: [
      {
        type: "tool_result",
        tool_use_id: "toolu_03",
        content: "Free 13:30–17:15. Event 'Design review' starts 17:30.",
      },
    ],
  },
  {
    role: "assistant",
    content: [
      {
        type: "text",
        text: "Yes — this afternoon is a good window for a run.\n\n• Head out around 14:30. It's 22°C and clear, with a light 12 km/h wind.\n• Finish by ~16:45 so you have time to cool down before your 17:30 Design review.\n• I couldn't confirm air quality — the service timed out — so if you're sensitive to it, glance at a local app before you leave.\n\nHave a good run!",
      },
    ],
  },
];

export const SAMPLE_JSON: string = JSON.stringify(SAMPLE_TRACE, null, 2);
