import { Check, X, Wrench, Zap } from 'lucide-react';
import { SkillsMatch } from '../types/jdMatch.types';

interface SkillsAnalysisProps {
  skillsMatch: SkillsMatch;
}

export function SkillsAnalysis({ skillsMatch }: SkillsAnalysisProps) {
  const { matched, missing, score } = skillsMatch;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
            <Wrench className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">Skills Match</h3>
            <span className={`text-sm font-semibold ${score >= 30 ? 'text-green-600' : score >= 15 ? 'text-yellow-600' : 'text-red-600'}`}>
              Score: {score}/40
            </span>
          </div>
        </div>
        <div className="text-right px-4 py-2 bg-gray-50 rounded-xl">
          <span className="text-2xl font-bold text-gray-800">
            {matched.length}
          </span>
          <span className="text-gray-400">/{matched.length + missing.length}</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Matched Skills */}
        <div className="bg-green-50/50 rounded-xl p-4 border border-green-100">
          <h4 className="flex items-center gap-2 text-sm font-bold text-green-800 mb-3">
            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            Matched Skills ({matched.length})
          </h4>
          {matched.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matched.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-200 hover:scale-105 hover:shadow-md transition-all duration-200 cursor-default"
                >
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3" />
                    {skill}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No skills matched</p>
          )}
        </div>

        {/* Divider with gradient */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Missing Skills */}
        <div className="bg-red-50/50 rounded-xl p-4 border border-red-100">
          <h4 className="flex items-center gap-2 text-sm font-bold text-red-800 mb-3">
            <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="w-4 h-4 text-red-600" />
            </div>
            Missing Skills ({missing.length})
          </h4>
          {missing.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missing.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-red-100 text-red-800 text-sm font-medium rounded-full border border-red-200 hover:scale-105 hover:shadow-md transition-all duration-200 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-700">
              <Check className="w-5 h-5" />
              <p className="text-sm font-medium">All required skills matched!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SkillsAnalysis;
