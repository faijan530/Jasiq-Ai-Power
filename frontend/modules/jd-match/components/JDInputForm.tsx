import { useState, useMemo } from 'react';
import { ChevronDown, FileText, Briefcase, Sparkles, AlertCircle } from 'lucide-react';
import { ResumeOption, ResumeVersionOption } from '../types/jdMatch.types';

interface JDInputFormProps {
  resumes: ResumeOption[];
  versions: ResumeVersionOption[];
  resumesLoading: boolean;
  versionsLoading: boolean;
  onResumeChange: (resumeId: string) => void;
  onSubmit: (data: { resumeId: string; versionId: string; jobDescription: string }) => void;
  loading: boolean;
}

export function JDInputForm({
  resumes,
  versions,
  resumesLoading,
  versionsLoading,
  onResumeChange,
  onSubmit,
  loading,
}: JDInputFormProps) {
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const wordCount = useMemo(() => {
    return jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;
  }, [jobDescription]);

  const isValid = selectedResumeId && selectedVersionId && wordCount >= 50;

  const handleResumeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedResumeId(value);
    setSelectedVersionId('');
    setError(null);
    onResumeChange(value);
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVersionId(e.target.value);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (wordCount < 50) {
      setError('Job description must be at least 50 words');
      return;
    }

    if (!selectedResumeId || !selectedVersionId) {
      setError('Please select a resume and version');
      return;
    }

    onSubmit({
      resumeId: selectedResumeId,
      versionId: selectedVersionId,
      jobDescription: jobDescription.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Job Description Match</h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">Select your resume and paste a job description to analyze match</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Resume Selector */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4 text-gray-400" />
            Select Resume
          </label>
          <div className="relative">
            <select
              value={selectedResumeId}
              onChange={handleResumeChange}
              disabled={resumesLoading || loading}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <option value="">{resumesLoading ? 'Loading resumes...' : 'Choose a resume'}</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Version Selector */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4 text-gray-400" />
            Select Version
          </label>
          <div className="relative">
            <select
              value={selectedVersionId}
              onChange={handleVersionChange}
              disabled={!selectedResumeId || versionsLoading || loading}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <option value="">
                {versionsLoading ? 'Loading versions...' : selectedResumeId ? 'Choose a version' : 'Select a resume first'}
              </option>
              {versions.map((version) => (
                <option key={version.id} value={version.id}>
                  Version {version.versionNumber} • {new Date(version.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Briefcase className="w-4 h-4 text-gray-400" />
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={loading}
            placeholder="Paste the full job description here (minimum 50 words)..."
            className="w-full h-48 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
          <div className="flex items-center justify-between">
            <span className={`text-xs ${wordCount >= 50 ? 'text-green-600' : 'text-gray-400'}`}>
              {wordCount} words {wordCount < 50 && `(minimum 50 required)`}
            </span>
            <span className={`text-xs ${wordCount >= 50 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
              {wordCount >= 50 ? '✓ Valid' : 'Keep typing...'}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
        >
          {loading ? (
            <>
              <Sparkles className="w-5 h-5 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Evaluate Match
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default JDInputForm;
