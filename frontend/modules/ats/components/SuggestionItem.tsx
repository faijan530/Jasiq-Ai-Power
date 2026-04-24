import { Lightbulb, AlertCircle, Info } from "lucide-react";
import { ATSSuggestion } from "../types/ats.dto";

interface SuggestionItemProps {
  suggestion: ATSSuggestion;
  index: number;
}

export const SuggestionItem = ({ suggestion, index }: SuggestionItemProps) => {
  const priorityIcons = {
    high: <AlertCircle className="w-5 h-5 text-red-500" />,
    medium: <Lightbulb className="w-5 h-5 text-amber-500" />,
    low: <Info className="w-5 h-5 text-blue-500" />,
  };

  const priorityStyles = {
    high: "border-l-4 border-red-500 bg-red-50",
    medium: "border-l-4 border-amber-500 bg-amber-50",
    low: "border-l-4 border-blue-500 bg-blue-50",
  };

  // Map backend suggestion to display format
  const title = suggestion.section || `Suggestion ${index + 1}`;
  const description = suggestion.message || "";
  const priority = suggestion.priority || "medium";

  return (
    <div
      className={`p-4 rounded-lg ${priorityStyles[priority]} hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {priorityIcons[priority]}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">
            {title}
          </h4>
          <p className="text-sm text-gray-600 mb-2">
            {description}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white text-gray-700 capitalize">
              {priority} Priority
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionItem;
