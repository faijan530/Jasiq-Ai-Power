export interface MatchScoreSections {
  skills: number;
  experience: number;
  keywords: number;
  roleFit: number;
}

export interface MatchScoreProps {
  overall: number;
  sections: MatchScoreSections;
}

export class MatchScore {
  private constructor(private props: MatchScoreProps) {}

  static create(sections: MatchScoreSections): MatchScore {
    const overall = Math.min(100, Math.round(
      sections.skills +
      sections.experience +
      sections.keywords +
      sections.roleFit
    ));

    return new MatchScore({
      overall,
      sections,
    });
  }

  get overall(): number {
    return this.props.overall;
  }

  get sections(): MatchScoreSections {
    return { ...this.props.sections };
  }

  toJSON(): MatchScoreProps {
    return {
      overall: this.props.overall,
      sections: { ...this.props.sections },
    };
  }
}
