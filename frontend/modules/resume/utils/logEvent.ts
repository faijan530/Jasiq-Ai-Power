export type ResumeEvent =
  | "resume_created"
  | "resume_updated"
  | "resume_pdf_generated";

export const logEvent = (event: ResumeEvent, payload: Record<string, unknown> = {}) => {
  // In a real app this would forward to an analytics pipeline.
  // Here we log in a structured way for debugging.
  // eslint-disable-next-line no-console
  console.info(
    JSON.stringify({
      type: "event",
      source: "resume_module",
      event,
      payload,
      at: new Date().toISOString(),
    })
  );
};

