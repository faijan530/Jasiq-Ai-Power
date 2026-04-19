import { ResumeVersion } from "../../resume/domain/entities/resume-version.entity";

export interface NormalizedResume {
  original: ResumeVersion;
  normalizedText: string;
  tokens: string[];
  sections: {
    summary?: string;
    skills?: string[];
    experience?: string[];
    education?: string[];
    projects?: string[];
    rawSections?: Record<string, any>;
  };
}

export class AtsNormalizerService {
  normalize(resume: ResumeVersion): NormalizedResume {
    // For now we operate on the textual representation of the resume JSON.
    const rawText = typeof resume.contentText === "string" ? resume.contentText : JSON.stringify(resume.rawJson);

    const normalizedText = this.normalizeText(rawText);
    const tokens = this.tokenize(normalizedText);
    const sections = this.detectSections(resume.rawJson);

    return {
      original: resume,
      normalizedText,
      tokens,
      sections,
    };
  }

  private normalizeText(text: string): string {
    // Lowercase, trim, collapse multiple spaces and normalize newlines
    const lower = text.toLowerCase();
    const collapsedWhitespace = lower.replace(/\s+/g, " ").trim();
    const normalizedNewlines = collapsedWhitespace.replace(/(?:\r\n|\r|\n)/g, "\n");
    return normalizedNewlines;
  }

  private tokenize(text: string): string[] {
    return text
      .split(/[^a-z0-9.+#]+/i)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }

  private detectSections(rawJson: any): NormalizedResume["sections"] {
    const sections: NormalizedResume["sections"] = {
      rawSections: rawJson?.sections ?? rawJson,
    };

    try {
      const source = rawJson?.sections ?? rawJson ?? {};

      if (typeof source.summary === "string") {
        sections.summary = source.summary;
      }

      if (Array.isArray(source.skills)) {
        sections.skills = source.skills.map((s: any) => String(s));
      }

      if (Array.isArray(source.experience)) {
        sections.experience = source.experience.map((exp: any) =>
          typeof exp === "string" ? exp : JSON.stringify(exp)
        );
      }

      if (Array.isArray(source.education)) {
        sections.education = source.education.map((edu: any) =>
          typeof edu === "string" ? edu : JSON.stringify(edu)
        );
      }

      if (Array.isArray(source.projects)) {
        sections.projects = source.projects.map((p: any) =>
          typeof p === "string" ? p : JSON.stringify(p)
        );
      }
    } catch {
      // If detection fails, we still return whatever we could infer.
    }

    return sections;
  }

  removeStopwords(tokens: string[]): string[] {
    const stopwords = new Set([
      "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
      "of", "with", "by", "from", "as", "is", "was", "are", "were", "be",
      "been", "being", "have", "has", "had", "do", "does", "did", "will",
      "would", "could", "should", "may", "might", "must", "can", "this",
      "that", "these", "those", "i", "me", "my", "myself", "we", "our",
      "you", "your", "he", "him", "his", "she", "her", "it", "its",
    ]);

    return tokens.filter((token) => !stopwords.has(token.toLowerCase()));
  }
}

