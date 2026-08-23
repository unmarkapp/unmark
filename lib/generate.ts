export const GENERATE_WEB_ENABLED = true;

export const GENERATE_MODELS = [
  {
    id: "gemini-3.1-flash-image",
    label: "Nano Banana 2",
    subtitle: "Best balance of quality and speed",
        credits: 2,
    },
    {
        id: "gemini-3.1-flash-lite-image",
        label: "Nano Banana 2 Lite",
        subtitle: "Fastest and cheapest",
        credits: 1,
    },
    {
        id: "gemini-3-pro-image",
        label: "Nano Banana Pro",
        subtitle: "Highest quality, slower",
        credits: 4,
    },
    {
        id: "gemini-2.5-flash-image",
        label: "Nano Banana",
        subtitle: "Original model",
        credits: 1,
  },
] as const;

export const GENERATE_ASPECTS = ["1:1", "16:9", "9:16", "4:3", "3:4"] as const;

export function creditPluralSuffix(count: number): string {
  return count === 1 ? "" : "s";
}
