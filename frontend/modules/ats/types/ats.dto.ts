// Backend ATS Response Structure
export interface ATSScoreBreakdown {
  skills: number;
  experience: number;
  education: number;
  formatting: number;
  keywords: number;
}

export interface KeywordMatch {
  keyword: string;
  found: boolean;
  context?: string;
  category: string;
}

export interface ATSIssue {
  type: "error" | "warning" | "info";
  section: string;
  message: string;
}

// Backend suggestion format
export interface ATSSuggestion {
  section: string;
  message: string;
  priority: "high" | "medium" | "low";
}

// Frontend display format (mapped from backend)
export interface ATSSuggestionDisplay {
  id: string;
  category: "keywords" | "skills" | "format" | "experience";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  impact: string;
}

export interface GapSkill {
  name: string;
  level: "major" | "minor";
  demand: "high" | "medium" | "low";
}

export interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  postedAt: string;
}

// Backend ATS Report Response
export interface ATSReport {
  atsReportId: string;
  overallScore: number;
  sectionScores: ATSScoreBreakdown;
  keywordMatches: KeywordMatch[];
  issues: ATSIssue[];
  suggestions: ATSSuggestion[];
  // These are computed/display fields, not from backend
  gapAnalysis?: GapSkill[];
  jobRecommendations?: JobRecommendation[];
}

export interface EvaluateATSRequest {
  resumeId: string;
  versionId: string;
  jobDescription?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  requestId?: string;
}
