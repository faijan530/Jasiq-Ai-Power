// Inline SVG Icons
const ZapIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const TargetIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrendingUpIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

interface ResumeTopBarProps {
  score: number;
  matchPercentage?: number;
  title?: string;
}

export function ResumeTopBar({ score, matchPercentage = 86, title = "Resume Score" }: ResumeTopBarProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-green-600 bg-green-100";
    if (s >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreMessage = (s: number) => {
    if (s >= 80) return "Excellent! Your resume is ATS-optimized";
    if (s >= 60) return "Good progress. A few improvements needed";
    return "Needs work. Follow the suggestions below";
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white p-5 rounded-xl shadow-lg shadow-blue-200 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <ZapIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold">{score}% {title}</p>
              <TrendingUpIcon className="w-4 h-4 text-blue-200" />
            </div>
            <p className="text-sm text-blue-100">{getScoreMessage(score)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={["px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2", getScoreColor(matchPercentage)].join(" ")}>
            <TargetIcon className="w-4 h-4" />
            {matchPercentage}% Match
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-blue-200 mt-1">
          <span>0%</span>
          <span>ATS Readiness</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
