export function logEvent(event: string, data?: Record<string, unknown>) {
  if (import.meta.env.DEV) {
    console.log(`[JD Match] ${event}`, data);
  }
}
