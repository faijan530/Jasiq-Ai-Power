// Security helpers: sanitize user-provided content before saving or rendering.
// Goal: prevent script injection (<script>) and strip HTML tags.

export const stripHtmlTags = (input: string): string => {
  // Remove any script blocks first.
  const withoutScripts = input.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  // Remove remaining HTML tags.
  return withoutScripts.replace(/<\/?[^>]+(>|$)/g, "");
};

export const sanitizeText = (value: unknown): string => {
  const str = typeof value === "string" ? value : value === null || value === undefined ? "" : String(value);
  return stripHtmlTags(str).trim();
};

export const sanitizeUrl = (value: unknown): string => {
  const str = typeof value === "string" ? value : value === null || value === undefined ? "" : String(value);
  const cleaned = sanitizeText(str);

  // Only allow http/https URLs. Anything else should be removed.
  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return cleaned;
    }
    return "";
  } catch {
    return "";
  }
};

// Minimal deep sanitation for the canonical resume JSON.
export const sanitizeCanonicalResumeJson = (json: any): any => {
  if (!json || typeof json !== "object") return json;

  const safe: any = { ...json };
  safe.basics = safe.basics ? { ...safe.basics } : {};

  safe.basics.name = sanitizeText(safe.basics.name);
  safe.basics.email = sanitizeText(safe.basics.email);
  safe.basics.phone = sanitizeText(safe.basics.phone);
  safe.basics.location = sanitizeText(safe.basics.location);
  safe.basics.summary = sanitizeText(safe.basics.summary);

  safe.skills = Array.isArray(safe.skills)
    ? safe.skills.map((s: any) => ({
        name: sanitizeText(s?.name),
        level: sanitizeText(s?.level),
      }))
    : [];

  safe.projects = Array.isArray(safe.projects)
    ? safe.projects.map((p: any) => ({
        title: sanitizeText(p?.title),
        description: sanitizeText(p?.description),
        techStack: Array.isArray(p?.techStack) ? p.techStack.map((t: any) => sanitizeText(t)) : [],
        link: sanitizeUrl(p?.link),
      }))
    : [];

  safe.education = Array.isArray(safe.education)
    ? safe.education.map((e: any) => ({
        institution: sanitizeText(e?.institution),
        degree: sanitizeText(e?.degree),
        startYear: sanitizeText(e?.startYear),
        endYear: sanitizeText(e?.endYear),
      }))
    : [];

  safe.experience = Array.isArray(safe.experience)
    ? safe.experience.map((x: any) => ({
        company: sanitizeText(x?.company),
        role: sanitizeText(x?.role),
        duration: sanitizeText(x?.duration),
        responsibilities: Array.isArray(x?.responsibilities)
          ? x.responsibilities.map((r: any) => sanitizeText(r)).filter(Boolean)
          : [],
      }))
    : [];

  safe.achievements = Array.isArray(safe.achievements) ? safe.achievements.map((a: any) => sanitizeText(a)).filter(Boolean) : [];

  safe.links = Array.isArray(safe.links)
    ? safe.links.map((l: any) => ({
        label: sanitizeText(l?.label),
        url: sanitizeUrl(l?.url),
      }))
    : [];

  return safe;
};

