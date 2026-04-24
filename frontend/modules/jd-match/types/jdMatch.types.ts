export interface EvaluateMatchRequest {
  resumeId: string;
  versionId: string;
  jobDescription: string;
}

export interface SkillsMatch {
  matched: string[];
  missing: string[];
  score: number;
}

export interface KeywordMatchItem {
  keyword: string;
  found: boolean;
  importance: 'required' | 'preferred' | 'bonus';
}

export interface KeywordAnalysis {
  matches: KeywordMatchItem[];
  matchedCount: number;
  totalCount: number;
  matchPercentage: number;
}

export interface ExperienceMatch {
  hasRelevantExperience: boolean;
  yearsOverlap: number;
  score: number;
}

export interface RoleFit {
  score: number;
  matchedTerms: string[];
}

export interface Suggestion {
  type: 'skill' | 'experience' | 'keyword' | 'general';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

export interface MatchReport {
  matchReportId: string;
  overallMatch: number;
  skillsMatch: SkillsMatch;
  keywordMatch: KeywordAnalysis;
  experienceMatch: ExperienceMatch;
  roleFitScore: number;
  suggestions: Suggestion[];
  jobTitle?: string;
  evaluatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  requestId?: string;
}

export type MatchScoreLabel = 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';

export interface ResumeOption {
  id: string;
  title: string;
}

export interface ResumeVersionOption {
  id: string;
  versionNumber: number;
  createdAt: string;
}
