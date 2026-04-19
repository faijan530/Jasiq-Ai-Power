import { NormalizedResume } from "./ats-normalizer.service";
import { SectionScores } from "../domain/value-objects/ats-score.vo";
import { KeywordMatch } from "../domain/value-objects/keyword-match.vo";
import { AtsIssue } from "../domain/entities/ats-report.entity";


export interface AtsRuleEngineResult {
  sectionScores: SectionScores;
  keywordMatches: KeywordMatch[];
  issues: AtsIssue[];
}

export class AtsRuleEngineService {
  private readonly MAX_SKILLS = 30;
  private readonly MAX_EXPERIENCE = 25;
  private readonly MAX_EDUCATION = 15;
  private readonly MAX_FORMATTING = 15;
  private readonly MAX_KEYWORDS = 15;

  evaluate(resume: NormalizedResume): AtsRuleEngineResult {
    const issues: AtsIssue[] = [];

    const skillsScore = this.evaluateSkills(resume, issues);
    const experienceScore = this.evaluateExperience(resume, issues);
    const educationScore = this.evaluateEducation(resume, issues);
    const formattingScore = this.evaluateFormatting(resume, issues);
    const keywordMatches = this.evaluateKeywords(resume, issues);
    const keywordScore = this.calculateKeywordScore(keywordMatches);

    const sectionScores: SectionScores = {
      skills: skillsScore,
      experience: experienceScore,
      education: educationScore,
      formatting: formattingScore,
      keywords: keywordScore,
    };

    return {
      sectionScores,
      keywordMatches,
      issues,
    };
  }

  private evaluateSkills(resume: NormalizedResume, issues: AtsIssue[]): number {
    const skills = resume.sections.skills ?? [];
    if (skills.length === 0) {
      issues.push({
        type: "error",
        section: "skills",
        message: "No skills section found.",
      });
      return 0;
    }

    const uniqueSkills = new Set(skills.map((s) => s.toLowerCase()));
    const score = Math.min(uniqueSkills.size * 3, this.MAX_SKILLS);

    if (uniqueSkills.size < 5) {
      issues.push({
        type: "warning",
        section: "skills",
        message: "Very few skills listed; consider expanding your skills section.",
      });
    }

    return score;
  }

  private evaluateExperience(resume: NormalizedResume, issues: AtsIssue[]): number {
    const experienceEntries = resume.sections.experience ?? [];
    if (experienceEntries.length === 0) {
      issues.push({
        type: "error",
        section: "experience",
        message: "No experience section found.",
      });
      return 0;
    }

    let score = 0;
    experienceEntries.forEach((entry) => {
      const length = entry.length;
      if (length > 150) {
        score += 5;
      } else if (length > 50) {
        score += 3;
      } else {
        score += 1;
      }
    });

    if (experienceEntries.length < 2) {
      issues.push({
        type: "warning",
        section: "experience",
        message: "Limited experience information; add more roles, projects, or responsibilities.",
      });
    }

    return Math.min(score, this.MAX_EXPERIENCE);
  }

  private evaluateEducation(resume: NormalizedResume, issues: AtsIssue[]): number {
    const educationEntries = resume.sections.education ?? [];
    if (educationEntries.length === 0) {
      issues.push({
        type: "warning",
        section: "education",
        message: "No education section found.",
      });
      return 0;
    }

    const baseScore = 8;
    const extra = Math.min(educationEntries.length * 2, this.MAX_EDUCATION - baseScore);
    return baseScore + extra;
  }

  private evaluateFormatting(resume: NormalizedResume, issues: AtsIssue[]): number {
    const text = resume.normalizedText;
    const lines = text.split("\n");
    const tooLongLines = lines.filter((l) => l.length > 120).length;

    let score = this.MAX_FORMATTING;

    if (tooLongLines > 5) {
      score -= 5;
      issues.push({
        type: "warning",
        section: "formatting",
        message: "Several lines are very long; improve formatting for readability.",
      });
    }

    const bulletCount = (text.match(/[-*•]/g) || []).length;
    if (bulletCount < 5) {
      score -= 5;
      issues.push({
        type: "warning",
        section: "formatting",
        message: "Few bullet points found; use bullets to make content more scannable.",
      });
    }

    return Math.max(0, score);
  }

  private evaluateKeywords(resume: NormalizedResume, issues: AtsIssue[]): KeywordMatch[] {
    const targetKeywords = [
      { keyword: "typescript", category: "skill" as const },
      { keyword: "node.js", category: "skill" as const },
      { keyword: "express", category: "skill" as const },
      { keyword: "postgresql", category: "skill" as const },
      { keyword: "rest api", category: "skill" as const },
      { keyword: "teamwork", category: "soft_skill" as const },
      { keyword: "leadership", category: "soft_skill" as const },
      { keyword: "communication", category: "soft_skill" as const },
      { keyword: "developed", category: "action_verb" as const },
      { keyword: "managed", category: "action_verb" as const },
      { keyword: "implemented", category: "action_verb" as const },
    ];

    const tokensSet = new Set(resume.tokens.map((t) => t.toLowerCase()));
    const keywordMatches: KeywordMatch[] = [];
    const missingKeywords: string[] = [];

    for (const { keyword, category } of targetKeywords) {
      const found = tokensSet.has(keyword.toLowerCase());
      keywordMatches.push(KeywordMatch.create(keyword, found, category));
      if (!found) {
        missingKeywords.push(keyword);
      }
    }

    if (missingKeywords.length > 0) {
      issues.push({
        type: "info",
        section: "keywords",
        message: `Your resume is missing some important keywords: ${missingKeywords.join(", ")}. Consider including them where relevant.`,
      });
    }

    return keywordMatches;
  }

  private calculateKeywordScore(keywordMatches: KeywordMatch[]): number {
    const foundCount = keywordMatches.filter((km) => km.found).length;
    const scorePerKeyword = this.MAX_KEYWORDS / keywordMatches.length;
    return Math.round(foundCount * scorePerKeyword);
  }
}

