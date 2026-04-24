import { Lightbulb, Sparkles } from "lucide-react";
import { SuggestionItem } from "./SuggestionItem";
import { ATSSuggestion } from "../types/ats.dto";

interface SuggestionPanelProps {
  suggestions: ATSSuggestion[];
  loading?: boolean;
}

export const SuggestionPanel = ({ suggestions, loading }: SuggestionPanelProps) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-gray-800">AI Suggestions</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-gray-800">AI Suggestions</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No suggestions yet. Analyze your resume to get personalized recommendations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <h3 className="font-semibold text-gray-800">
          AI Suggestions ({suggestions.length})
        </h3>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <SuggestionItem key={index} suggestion={suggestion} index={index} />
        ))}
      </div>
    </div>
  );
};

export default SuggestionPanel;
