import { useState, useCallback, useEffect } from 'react';
import { jdMatchApi } from '../services/jdMatch.api';
import { 
  MatchReport, 
  EvaluateMatchRequest, 
  ResumeOption, 
  ResumeVersionOption 
} from '../types/jdMatch.types';

interface UseJDMatchReturn {
  // Actions
  evaluateMatch: (request: EvaluateMatchRequest) => Promise<void>;
  fetchReport: (versionId: string) => Promise<void>;
  loadResumes: () => Promise<void>;
  loadVersions: (resumeId: string) => Promise<void>;
  reset: () => void;

  // State
  loading: boolean;
  data: MatchReport | null;
  error: string | null;
  resumes: ResumeOption[];
  versions: ResumeVersionOption[];
  resumesLoading: boolean;
  versionsLoading: boolean;
}

export function useJDMatch(): UseJDMatchReturn {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MatchReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [resumes, setResumes] = useState<ResumeOption[]>([]);
  const [versions, setVersions] = useState<ResumeVersionOption[]>([]);
  const [resumesLoading, setResumesLoading] = useState(false);
  const [versionsLoading, setVersionsLoading] = useState(false);

  const evaluateMatch = useCallback(async (request: EvaluateMatchRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validation
      const wordCount = request.jobDescription.trim().split(/\s+/).length;
      if (wordCount < 50) {
        throw new Error('Job description must be at least 50 words');
      }

      const result = await jdMatchApi.evaluateMatch(request);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReport = useCallback(async (versionId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await jdMatchApi.getReportByVersionId(versionId);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadResumes = useCallback(async () => {
    setResumesLoading(true);
    
    try {
      const result = await jdMatchApi.getUserResumes();
      setResumes(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load resumes';
      setError(message);
    } finally {
      setResumesLoading(false);
    }
  }, []);

  const loadVersions = useCallback(async (resumeId: string) => {
    if (!resumeId) {
      setVersions([]);
      return;
    }
    
    setVersionsLoading(true);
    
    try {
      const result = await jdMatchApi.getResumeVersions(resumeId);
      setVersions(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load versions';
      setError(message);
    } finally {
      setVersionsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  // Auto-load resumes on mount
  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  return {
    evaluateMatch,
    fetchReport,
    loadResumes,
    loadVersions,
    reset,
    loading,
    data,
    error,
    resumes,
    versions,
    resumesLoading,
    versionsLoading,
  };
}

export default useJDMatch;
