export interface SkillsMatchDto {
  matched: string[];
  missing: string[];
  score: number;
}

export interface KeywordMatchDto {
  keyword: string;
  found: boolean;
  context?: string;
  importance: string;
}

export interface KeywordMatchSummaryDto {
  matches: KeywordMatchDto[];
  matchedCount: number;
  totalCount: number;
  matchPercentage: number;
}

export interface ExperienceMatchDto {
  hasRelevantExperience: boolean;
  yearsOverlap: number;
  score: number;
}

export interface JdMatchSuggestionDto {
  type: string;
  message: string;
  priority: string;
}

export interface JdMatchReportResponseDto {
  matchReportId: string;
  overallMatch: number;
  skillsMatch: SkillsMatchDto;
  keywordMatch: KeywordMatchSummaryDto;
  experienceMatch: ExperienceMatchDto;
  roleFitScore: number;
  suggestions: JdMatchSuggestionDto[];
}
