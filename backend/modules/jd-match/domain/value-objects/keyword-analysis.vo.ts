export interface KeywordMatch {
  keyword: string;
  found: boolean;
  context?: string;
  importance: "required" | "preferred" | "bonus";
}

export interface KeywordAnalysisProps {
  matches: KeywordMatch[];
  matchedCount: number;
  totalCount: number;
  matchPercentage: number;
}

export class KeywordAnalysis {
  private constructor(private props: KeywordAnalysisProps) {}

  static create(matches: KeywordMatch[]): KeywordAnalysis {
    const totalCount = matches.length;
    const matchedCount = matches.filter((m) => m.found).length;
    const matchPercentage = totalCount > 0 ? Math.round((matchedCount / totalCount) * 100) : 0;

    return new KeywordAnalysis({
      matches,
      matchedCount,
      totalCount,
      matchPercentage,
    });
  }

  get matches(): KeywordMatch[] {
    return [...this.props.matches];
  }

  get matchedCount(): number {
    return this.props.matchedCount;
  }

  get totalCount(): number {
    return this.props.totalCount;
  }

  get matchPercentage(): number {
    return this.props.matchPercentage;
  }

  getMatchedKeywords(): string[] {
    return this.props.matches.filter((m) => m.found).map((m) => m.keyword);
  }

  getMissingKeywords(): string[] {
    return this.props.matches.filter((m) => !m.found).map((m) => m.keyword);
  }

  toJSON() {
    return {
      matches: this.props.matches,
      matchedCount: this.props.matchedCount,
      totalCount: this.props.totalCount,
      matchPercentage: this.props.matchPercentage,
    };
  }
}
