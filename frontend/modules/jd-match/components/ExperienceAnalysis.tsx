import { Briefcase, Clock, TrendingUp, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ExperienceMatch } from '../types/jdMatch.types';

interface ExperienceAnalysisProps {
  experienceMatch: ExperienceMatch;
}

export function ExperienceAnalysis({ experienceMatch }: ExperienceAnalysisProps) {
  const { hasRelevantExperience, yearsOverlap, score } = experienceMatch;
  const progressPercent = (score / 20) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center shadow-sm">
            <Briefcase className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">Experience Fit</h3>
            <span className={`text-sm font-semibold ${score >= 15 ? 'text-green-600' : score >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
              Score: {score}/20 Points
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Relevant Experience Status with Enhanced Warning Box */}
        <div className={`p-4 rounded-xl border-2 ${hasRelevantExperience ? 'bg-green-50/80 border-green-200' : 'bg-red-50/80 border-red-200'}`}>
          <div className="flex items-start gap-3">
            {hasRelevantExperience ? (
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            )}
            <div>
              <h4 className={`font-bold text-base ${hasRelevantExperience ? 'text-green-800' : 'text-red-800'}`}>
                {hasRelevantExperience ? 'Relevant Experience Found' : 'Limited Relevant Experience'}
              </h4>
              <p className={`text-sm mt-1 leading-relaxed ${hasRelevantExperience ? 'text-green-700' : 'text-red-700'}`}>
                {hasRelevantExperience
                  ? 'Your resume shows relevant work experience and projects that align with the job requirements.'
                  : 'Consider adding more relevant work experience or projects to strengthen your application.'}
              </p>
            </div>
          </div>
        </div>

        {/* Years of Experience */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
            <Clock className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Estimated Experience</p>
            <p className="text-2xl font-bold text-gray-800">
              {yearsOverlap} {yearsOverlap === 1 ? 'Year' : 'Years'}
            </p>
          </div>
        </div>

        {/* Enhanced Score Breakdown with Visual Progress */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Experience Points</span>
            <span className={`text-sm font-bold ${score >= 15 ? 'text-green-600' : score >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
              {score}/20
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 shadow-sm ${
                score >= 15 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                score >= 10 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                'bg-gradient-to-r from-red-400 to-red-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {score >= 15 ? 'Strong experience match!' : 
             score >= 10 ? 'Moderate experience alignment' : 
             'Experience gap detected'}
          </p>
        </div>

        {/* Enhanced Tips Section */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-bold text-blue-800">Improvement Tips</span>
          </div>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <span>Quantify achievements with metrics (%, $, numbers)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <span>Highlight projects using technologies mentioned in the JD</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <span>Include specific responsibilities matching the role</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ExperienceAnalysis;
