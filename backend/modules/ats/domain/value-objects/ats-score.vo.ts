export interface SectionScores {
  skills: number;
  experience: number;
  education: number;
  formatting: number;
  keywords: number;
}

export interface AtsScoreProps {
  overall: number;
  sections: SectionScores;
}

export class AtsScore {
  private constructor(private props: AtsScoreProps) {}

  static create(sections: SectionScores): AtsScore {
    const overall = Math.round(
      (sections.skills +
        sections.experience +
        sections.education +
        sections.formatting +
        sections.keywords) /
        5
    );

    return new AtsScore({
      overall,
      sections,
    });
  }

  get overall(): number {
    return this.props.overall;
  }

  get sections(): SectionScores {
    return { ...this.props.sections };
  }

  toJSON(): AtsScoreProps {
    return {
      overall: this.props.overall,
      sections: { ...this.props.sections },
    };
  }
}
