import { Search, CheckCircle, AlertCircle, Target } from 'lucide-react';
import { KeywordAnalysis as KeywordAnalysisType } from '../types/jdMatch.types';

interface KeywordAnalysisProps {
  keywordAnalysis: KeywordAnalysisType;
}

export function KeywordAnalysis({ keywordAnalysis }: KeywordAnalysisProps) {
  const { matches, matchedCount, totalCount, matchPercentage } = keywordAnalysis;

  const foundKeywords = matches.filter(m => m.found);
  const missingKeywords = matches.filter(m => !m.found);

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'required': return 'bg-red-100 text-red-700 border-red-200';
      case 'preferred': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'bonus': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-sm">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">Keyword Analysis</h3>
            <span className={`text-sm font-semibold ${matchPercentage >= 60 ? 'text-green-600' : matchPercentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
              {Math.round(matchPercentage)}% Match Rate
            </span>
          </div>
        </div>
        <div className="text-right px-4 py-2 bg-gray-50 rounded-xl">
          <span className="text-2xl font-bold text-gray-800">{matchedCount}</span>
          <span className="text-gray-400">/{totalCount}</span>
        </div>
      </div>

      {/* Enhanced Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Keyword Coverage</span>
          <span className={`text-sm font-bold ${matchPercentage >= 60 ? 'text-green-600' : matchPercentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
            {Math.round(matchPercentage)}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 shadow-sm ${
              matchPercentage >= 60 ? 'bg-gradient-to-r from-green-400 to-green-500' : 
              matchPercentage >= 40 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
              'bg-gradient-to-r from-red-400 to-red-500'
            }`}
            style={{ width: `${matchPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Found Keywords Section */}
        <div className="bg-green-50/70 rounded-xl p-4 border border-green-200">
          <h4 className="flex items-center gap-2 text-sm font-bold text-green-800 mb-3">
            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <span className="flex items-center gap-2">
              Found Keywords
              <span className="px-2 py-0.5 bg-green-200 text-green-800 text-xs rounded-full">
                {foundKeywords.length}
              </span>
            </span>
          </h4>
          {foundKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {foundKeywords.map((item, index) => (
                <span
                  key={index}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full border-2 ${getImportanceColor(item.importance)} hover:scale-105 hover:shadow-sm transition-all duration-200 cursor-default`}
                >
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3" />
                    {item.keyword}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No keywords found in resume</p>
          )}
        </div>

        {/* Missing Keywords Section */}
        <div className="bg-red-50/70 rounded-xl p-4 border border-red-200">
          <h4 className="flex items-center gap-2 text-sm font-bold text-red-800 mb-3">
            <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <span className="flex items-center gap-2">
              Missing Keywords
              <span className="px-2 py-0.5 bg-red-200 text-red-800 text-xs rounded-full">
                {missingKeywords.length}
              </span>
            </span>
          </h4>
          {missingKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((item, index) => (
                <span
                  key={index}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full border-2 border-dashed hover:border-solid ${getImportanceColor(item.importance)} hover:scale-105 transition-all duration-200 cursor-default`}
                >
                  <span className="flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3" />
                    {item.keyword}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-medium">All important keywords found!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default KeywordAnalysis;
