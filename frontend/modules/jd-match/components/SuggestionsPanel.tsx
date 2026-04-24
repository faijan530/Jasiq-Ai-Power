import { Lightbulb, Target, Wrench, FileText, AlertTriangle, Info, CheckCircle2, Sparkles } from 'lucide-react';
import { Suggestion } from '../types/jdMatch.types';

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
}

const priorityConfig = {
  high: {
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-gradient-to-br from-red-50 to-red-100/50',
    borderColor: 'border-red-300',
    leftBorder: 'border-l-4 border-l-red-500',
    badge: 'bg-red-200 text-red-800',
    label: 'High Priority',
  },
  medium: {
    icon: Info,
    color: 'text-yellow-600',
    bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100/50',
    borderColor: 'border-yellow-300',
    leftBorder: 'border-l-4 border-l-yellow-500',
    badge: 'bg-yellow-200 text-yellow-800',
    label: 'Medium Priority',
  },
  low: {
    icon: CheckCircle2,
    color: 'text-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
    borderColor: 'border-blue-300',
    leftBorder: 'border-l-4 border-l-blue-500',
    badge: 'bg-blue-200 text-blue-800',
    label: 'Low Priority',
  },
};

const typeConfig = {
  skill: {
    icon: Wrench,
    label: 'Skill',
    color: 'text-purple-600 bg-purple-100',
  },
  experience: {
    icon: FileText,
    label: 'Experience',
    color: 'text-orange-600 bg-orange-100',
  },
  keyword: {
    icon: Target,
    label: 'Keyword',
    color: 'text-green-600 bg-green-100',
  },
  general: {
    icon: Lightbulb,
    label: 'General',
    color: 'text-indigo-600 bg-indigo-100',
  },
};

export function SuggestionsPanel({ suggestions }: SuggestionsPanelProps) {
  // Sort by priority: high first, then medium, then low
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const highPriorityCount = suggestions.filter(s => s.priority === 'high').length;
  const mediumPriorityCount = suggestions.filter(s => s.priority === 'medium').length;
  const lowPriorityCount = suggestions.filter(s => s.priority === 'low').length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center shadow-sm">
            <Sparkles className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">AI Suggestions</h3>
            <span className="text-sm text-gray-500">
              {suggestions.length} recommendation{suggestions.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        {/* Priority badges */}
        <div className="flex gap-2">
          {highPriorityCount > 0 && (
            <span className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-full shadow-sm">
              {highPriorityCount} High
            </span>
          )}
          {mediumPriorityCount > 0 && (
            <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full shadow-sm">
              {mediumPriorityCount} Medium
            </span>
          )}
          {lowPriorityCount > 0 && highPriorityCount === 0 && mediumPriorityCount === 0 && (
            <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full shadow-sm">
              {lowPriorityCount} Low
            </span>
          )}
        </div>
      </div>

      {/* Suggestions List - Stacked Cards */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {sortedSuggestions.length > 0 ? (
          sortedSuggestions.map((suggestion, index) => {
            const priorityStyle = priorityConfig[suggestion.priority];
            const typeStyle = typeConfig[suggestion.type];
            const PriorityIcon = priorityStyle.icon;
            const TypeIcon = typeStyle.icon;

            return (
              <div
                key={index}
                className={`p-4 rounded-xl border ${priorityStyle.borderColor} ${priorityStyle.bgColor} ${priorityStyle.leftBorder} transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 cursor-default`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${priorityStyle.color}`}>
                    <PriorityIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${priorityStyle.badge}`}>
                        {priorityStyle.label}
                      </span>
                      <span className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${typeStyle.color}`}>
                        <TypeIcon className="w-3 h-3" />
                        {typeStyle.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {suggestion.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-green-50/50 rounded-xl border border-green-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-gray-700 font-bold text-lg">Great job!</p>
            <p className="text-sm text-gray-500 mt-1">
              No major suggestions. Your resume looks well-optimized.
            </p>
          </div>
        )}
      </div>

      {/* Action hint */}
      {highPriorityCount > 0 && (
        <div className="mt-5 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 shadow-sm">
          <p className="text-sm text-red-800 font-medium">
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            <strong>Action recommended:</strong> Address the {highPriorityCount} high priority item{highPriorityCount > 1 ? 's' : ''} first for maximum impact.
          </p>
        </div>
      )}
    </div>
  );
}

export default SuggestionsPanel;
