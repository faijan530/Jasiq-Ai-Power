import { CircularProgress } from "./CircularProgress";
import { ATSScoreBreakdown } from "../types/ats.dto";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface ATSScoreCardProps {
  overallScore: number;
  sectionScores: ATSScoreBreakdown;
}

export const ATSScoreCard = ({
  overallScore,
  sectionScores,
}: ATSScoreCardProps) => {
  const getScoreStatus = (score: number) => {
    if (score >= 80)
      return {
        label: "ATS Friendly",
        icon: <CheckCircle className="w-4 h-4" />,
        color: "text-green-600 bg-green-100",
      };
    if (score >= 60)
      return {
        label: "Needs Improvement",
        icon: <AlertTriangle className="w-4 h-4" />,
        color: "text-amber-600 bg-amber-100",
      };
    return {
      label: "Poor ATS Score",
      icon: <XCircle className="w-4 h-4" />,
      color: "text-red-600 bg-red-100",
    };
  };

  const status = getScoreStatus(overallScore);

  const progressBars = [
    { label: "Keywords", score: sectionScores.keywords, color: "bg-blue-500" },
    { label: "Skills", score: sectionScores.skills, color: "bg-purple-500" },
    { label: "Formatting", score: sectionScores.formatting, color: "bg-green-500" },
    { label: "Experience", score: sectionScores.experience, color: "bg-amber-500" },
    { label: "Education", score: sectionScores.education, color: "bg-pink-500" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Circular Progress */}
        <div className="flex flex-col items-center">
          <CircularProgress percentage={overallScore} size={140} strokeWidth={10} />
          <div
            className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}
          >
            {status.icon}
            {status.label}
          </div>
        </div>

        {/* Right: Score Breakdown */}
        <div className="flex-1 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Score Breakdown</h3>
          <div className="space-y-3">
            {progressBars.map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{bar.label}</span>
                  <span className="font-medium text-gray-900">{bar.score}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${bar.color}`}
                    style={{ width: `${bar.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSScoreCard;
