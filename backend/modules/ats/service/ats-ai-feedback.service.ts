import { NormalizedResume } from "./ats-normalizer.service";
import { SectionScores } from "../domain/value-objects/ats-score.vo";
import { KeywordMatch } from "../domain/value-objects/keyword-match.vo";
import { AtsIssue, AtsSuggestion } from "../domain/entities/ats-report.entity";

export interface AtsAiFeedbackConfig {
  enabled: boolean;
  provider?: string;
  apiKey?: string;
}

export class AtsAiFeedbackService {
  private config: AtsAiFeedbackConfig;

  constructor(config?: AtsAiFeedbackConfig) {
    this.config = config ?? { enabled: true };
  }

  async generateFeedback(
    resume: NormalizedResume,
    sectionScores: SectionScores,
    keywordMatches: KeywordMatch[],
    issues: AtsIssue[]
  ): Promise<AtsSuggestion[]> {
    if (!this.config.enabled) {
      return [];
    }

    const suggestions: AtsSuggestion[] = [];

    if (sectionScores.skills < 20) {
      suggestions.push({
        section: "skills",
        message: "Expand your skills section with more specific tools, frameworks, and technologies relevant to your target roles.",
        priority: "high",
      });
    }

    if (sectionScores.experience < 15) {
      suggestions.push({
        section: "experience",
        message: "Add more detail to your experience section with measurable impact, technologies used, and responsibilities.",
        priority: "high",
      });
    }

    if (sectionScores.education < 10) {
      suggestions.push({
        section: "education",
        message: "Highlight coursework, academic projects, or certifications that are relevant to your target role.",
        priority: "medium",
      });
    }

    if (sectionScores.formatting < 10) {
      suggestions.push({
        section: "formatting",
        message: "Improve formatting by using consistent headings, bullet points, and spacing to make your resume easier to scan.",
        priority: "medium",
      });
    }

    const missingKeywords = keywordMatches.filter((km) => !km.found).map((km) => km.keyword);
    if (missingKeywords.length > 0) {
      suggestions.push({
        section: "keywords",
        message: `Naturally incorporate missing role-specific keywords where they accurately describe your experience: ${missingKeywords.join(", ")}.`,
        priority: "medium",
      });
    }

    if (suggestions.length === 0 && issues.length === 0) {
      suggestions.push({
        section: "general",
        message: "Your resume is in strong shape. Focus on tailoring it to specific job descriptions for maximum impact.",
        priority: "low",
      });
    }

    return suggestions;
  }

  async generateGrammarFeedback(text: string): Promise<string[]> {
    if (!this.config.enabled) {
      return [];
    }

    return [];
  }
}

