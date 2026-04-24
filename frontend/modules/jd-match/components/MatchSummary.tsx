import { CheckCircle2, XCircle, Award, TrendingUp, FileCheck } from 'lucide-react';
import { SkillsMatch, KeywordAnalysis, ExperienceMatch } from '../types/jdMatch.types';

interface MatchSummaryProps {
  overallMatch: number;
  skillsMatch: SkillsMatch;
  keywordMatch: KeywordAnalysis;
  experienceMatch: ExperienceMatch;
}

export function MatchSummary({ overallMatch, skillsMatch, keywordMatch, experienceMatch }: MatchSummaryProps) {
  const { matched, missing } = skillsMatch;
  const { matchedCount, totalCount, matchPercentage } = keywordMatch;
  
  // Calculate overall fit based on score
  const getOverallFit = (score: number) => {
    if (score >= 70) return { label: 'Good', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (score >= 40) return { label: 'Partial', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { label: 'Low', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const fit = getOverallFit(overallMatch);

  const summaryItems = [
    {
      icon: CheckCircle2,
      label: 'Skills matched',
      value: matched.length,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: XCircle,
      label: 'Missing keywords',
      value: missing.length,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: Award,
      label: 'Experience level',
      value: `${experienceMatch.yearsOverlap} ${experienceMatch.yearsOverlap === 1 ? 'Year' : 'Years'}`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: TrendingUp,
      label: 'Overall fit',
      value: fit.label,
      color: fit.color,
      bgColor: fit.bgColor,
      isBadge: true,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center shadow-sm">
          <FileCheck className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-bold text-xl text-gray-800">Match Summary</h3>
          <p className="text-sm text-gray-500">Quick overview of your resume compatibility</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:scale-105 hover:shadow-md transition-all duration-200"
          >
            <div className={`w-10 h-10 ${item.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
              <p className={`text-sm font-semibold ${item.color}`}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Keyword Match Mini Progress */}
      <div className="mt-6 p-4 bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Keyword Match Rate</span>
          <span className={`text-sm font-semibold ${matchPercentage >= 60 ? 'text-green-600' : matchPercentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
            {Math.round(matchPercentage)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-700 rounded-full ${
              matchPercentage >= 60 ? 'bg-green-500' : matchPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${matchPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {matchedCount} of {totalCount} keywords found in your resume
        </p>
      </div>
    </div>
  );
}

export default MatchSummary;
