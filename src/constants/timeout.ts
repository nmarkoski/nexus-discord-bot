export const TIMEOUT_PRESETS = [
  { label: '1 minute', minutes: 1 },
  { label: '30 minutes', minutes: 30 },
  { label: '1 hour', minutes: 60 },
  { label: '2 hours', minutes: 120 },
  { label: '4 hours', minutes: 240 },
  { label: '8 hours', minutes: 480 },
  { label: '1 day', minutes: 1_440 },
] as const;
