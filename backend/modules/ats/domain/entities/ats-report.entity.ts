import { AtsScore, SectionScores } from "../value-objects/ats-score.vo";
import { KeywordMatch } from "../value-objects/keyword-match.vo";

export interface AtsIssue {
  type: "error" | "warning" | "info";
  section: string;
  message: string;
}

export interface AtsSuggestion {
  section: string;
  message: string;
  priority: "high" | "medium" | "low";
}

export interface AtsReportProps {
  id: string;
  resumeId: string;
  versionId: string;
  tenantId: string;
  score: AtsScore;
  keywordMatches: KeywordMatch[];
  issues: AtsIssue[];
  suggestions: AtsSuggestion[];
  createdAt: Date;
  updatedAt: Date;
}

export class AtsReport {
  private constructor(private props: AtsReportProps) {}

  static create(
    id: string,
    resumeId: string,
    versionId: string,
    tenantId: string,
    sectionScores: SectionScores,
    keywordMatches: KeywordMatch[],
    issues: AtsIssue[],
    suggestions: AtsSuggestion[]
  ): AtsReport {
    const now = new Date();
    const score = AtsScore.create(sectionScores);

    return new AtsReport({
      id,
      resumeId,
      versionId,
      tenantId,
      score,
      keywordMatches,
      issues,
      suggestions,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: AtsReportProps): AtsReport {
    return new AtsReport({
      ...props,
      score: AtsScore.create(props.score.sections),
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

  get score(): AtsScore {
    return this.props.score;
  }

  get keywordMatches(): KeywordMatch[] {
    return [...this.props.keywordMatches];
  }

  get issues(): AtsIssue[] {
    return [...this.props.issues];
  }

  get suggestions(): AtsSuggestion[] {
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
      overallScore: this.props.score.overall,
      sectionScores: this.props.score.sections,
      keywordMatches: this.props.keywordMatches.map((km) => km.toJSON()),
      issues: this.props.issues,
      suggestions: this.props.suggestions,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
