export interface KeywordMatchProps {
  keyword: string;
  found: boolean;
  context?: string;
  category: "skill" | "industry" | "soft_skill" | "action_verb";
}

export class KeywordMatch {
  private constructor(private props: KeywordMatchProps) {}

  static create(
    keyword: string,
    found: boolean,
    category: "skill" | "industry" | "soft_skill" | "action_verb",
    context?: string
  ): KeywordMatch {
    return new KeywordMatch({
      keyword,
      found,
      category,
      context,
    });
  }

  get keyword(): string {
    return this.props.keyword;
  }

  get found(): boolean {
    return this.props.found;
  }

  get context(): string | undefined {
    return this.props.context;
  }

  get category(): string {
    return this.props.category;
  }

  toJSON() {
    return {
      keyword: this.props.keyword,
      found: this.props.found,
      category: this.props.category,
      context: this.props.context,
    };
  }
}
