import { useRef, useEffect } from 'react';
import { Target, ArrowLeft } from 'lucide-react';
import { useJDMatch } from '../hooks/useJDMatch';
import { JDInputForm } from '../components/JDInputForm';
import { MatchScoreCard } from '../components/MatchScoreCard';
import { MatchSummary } from '../components/MatchSummary';
import { SkillsAnalysis } from '../components/SkillsAnalysis';
import { KeywordAnalysis } from '../components/KeywordAnalysis';
import { ExperienceAnalysis } from '../components/ExperienceAnalysis';
import { SuggestionsPanel } from '../components/SuggestionsPanel';
import { LoadingState } from '../components/LoadingState';

export function JDMatchPage() {
  const {
    evaluateMatch,
    loading,
    data,
    error,
    resumes,
    versions,
    resumesLoading,
    versionsLoading,
    loadVersions,
    reset,
  } = useJDMatch();

  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to results when data is loaded
  useEffect(() => {
    if (data && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [data]);

  const handleSubmit = async (formData: {
    resumeId: string;
    versionId: string;
    jobDescription: string;
  }) => {
    await evaluateMatch(formData);
  };

  const handleResumeChange = (resumeId: string) => {
    loadVersions(resumeId);
  };

  return (
    <div className="min-h-screen bg-[#F3F2EF]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#e8f3ff] rounded-md flex items-center justify-center">
                <Target className="w-5 h-5 text-[#0a66c2]" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">JD Match</h1>
                <p className="text-xs text-gray-500">Compare your resume against job descriptions</p>
              </div>
            </div>
            
            {data && (
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                New Analysis
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <div className="max-w-2xl mx-auto">
          <JDInputForm
            resumes={resumes}
            versions={versions}
            resumesLoading={resumesLoading}
            versionsLoading={versionsLoading}
            onResumeChange={handleResumeChange}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>

        {/* Error Display */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-2xl mx-auto mt-8">
            <LoadingState />
          </div>
        )}

        {/* Results Section */}
        {data && !loading && (
          <div ref={resultsRef} className="mt-10 space-y-8 animate-fadeIn">
            {/* Score Card */}
            <MatchScoreCard score={data.overallMatch} jobTitle={data.jobTitle} />

            {/* Match Summary Card */}
            <MatchSummary
              overallMatch={data.overallMatch}
              skillsMatch={data.skillsMatch}
              keywordMatch={data.keywordMatch}
              experienceMatch={data.experienceMatch}
            />

            {/* Two Column Grid - First Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Skills Analysis */}
              <SkillsAnalysis skillsMatch={data.skillsMatch} />

              {/* Keyword Analysis */}
              <KeywordAnalysis keywordAnalysis={data.keywordMatch} />
            </div>

            {/* Two Column Grid - Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Experience Analysis */}
              <ExperienceAnalysis experienceMatch={data.experienceMatch} />

              {/* Suggestions Panel */}
              <SuggestionsPanel suggestions={data.suggestions} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!data && !loading && !error && (
          <div className="mt-12 text-center bg-white p-12 rounded-lg shadow-sm border border-gray-200 max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-[#e8f3ff] rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-[#0a66c2]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Ready to Analyze</h3>
            <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
              Select your resume and paste a job description above to see how well your profile matches the role.
            </p>
          </div>
        )}
      </div>

      {/* CSS for fade animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default JDMatchPage;
