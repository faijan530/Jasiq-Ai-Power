export interface AtsSectionScoresDto {
  skills: number;
  experience: number;
  education: number;
  formatting: number;
  keywords: number;
}

export interface AtsKeywordMatchDto {
  keyword: string;
  found: boolean;
  context?: string;
  category: string;
}

export interface AtsIssueDto {
  type: "error" | "warning" | "info";
  section: string;
  message: string;
}

export interface AtsSuggestionDto {
  section: string;
  message: string;
  priority: "high" | "medium" | "low";
}

export interface AtsReportResponseDto {
  atsReportId: string;
  overallScore: number;
  sectionScores: AtsSectionScoresDto;
  keywordMatches: AtsKeywordMatchDto[];
  issues: AtsIssueDto[];
  suggestions: AtsSuggestionDto[];
}
