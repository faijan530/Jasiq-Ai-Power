import { MatchScore, MatchScoreSections } from "../value-objects/match-score.vo";
import { KeywordAnalysis } from "../value-objects/keyword-analysis.vo";

export interface SkillsMatch {
  matched: string[];
  missing: string[];
  score: number;
}

export interface ExperienceMatch {
  hasRelevantExperience: boolean;
  yearsOverlap: number;
  score: number;
}

export interface JdMatchSuggestion {
  type: "skill" | "experience" | "keyword" | "general";
  message: string;
  priority: "high" | "medium" | "low";
}

export interface JdMatchReportProps {
  id: string;
  resumeId: string;
  versionId: string;
  tenantId: string;
  jobTitle: string;
  jdText: string;
  score: MatchScore;
  skillsMatch: SkillsMatch;
  keywordAnalysis: KeywordAnalysis;
  experienceMatch: ExperienceMatch;
  suggestions: JdMatchSuggestion[];
  createdAt: Date;
  updatedAt: Date;
}

export class JdMatchReport {
  private constructor(private props: JdMatchReportProps) {}

  static create(
    id: string,
    resumeId: string,
    versionId: string,
    tenantId: string,
    jobTitle: string,
    jdText: string,
    sectionScores: MatchScoreSections,
    skillsMatch: SkillsMatch,
    keywordAnalysis: KeywordAnalysis,
    experienceMatch: ExperienceMatch,
    suggestions: JdMatchSuggestion[]
  ): JdMatchReport {
    const now = new Date();
    const score = MatchScore.create(sectionScores);

    return new JdMatchReport({
      id,
      resumeId,
      versionId,
      tenantId,
      jobTitle,
      jdText,
      score,
      skillsMatch,
      keywordAnalysis,
      experienceMatch,
      suggestions,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: JdMatchReportProps): JdMatchReport {
    return new JdMatchReport({
      ...props,
      score: MatchScore.create(props.score.sections),
      keywordAnalysis: KeywordAnalysis.create(props.keywordAnalysis.matches),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get resumeId(): string {
    return this.props.resumeId;
  }

  get versionId(): string {
    return this.props.versionId;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get jobTitle(): string {
    return this.props.jobTitle;
  }

  get jdText(): string {
    return this.props.jdText;
  }

  get score(): MatchScore {
    return this.props.score;
  }

  get skillsMatch(): SkillsMatch {
    return this.props.skillsMatch;
  }

  get keywordAnalysis(): KeywordAnalysis {
    return this.props.keywordAnalysis;
  }

  get experienceMatch(): ExperienceMatch {
    return this.props.experienceMatch;
  }

  get suggestions(): JdMatchSuggestion[] {
    return [...this.props.suggestions];
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toJSON() {
    return {
      id: this.props.id,
      resumeId: this.props.resumeId,
      versionId: this.props.versionId,
      tenantId: this.props.tenantId,
      jobTitle: this.props.jobTitle,
      jdText: this.props.jdText,
      overallMatch: this.props.score.overall,
      skillsMatch: this.props.skillsMatch,
      keywordMatch: this.props.keywordAnalysis.toJSON(),
      experienceMatch: this.props.experienceMatch,
      roleFitScore: this.props.score.sections.roleFit,
      suggestions: this.props.suggestions,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
