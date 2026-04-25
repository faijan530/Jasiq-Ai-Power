import { useState } from "react";
import { analyzeResumeWithAI, type AIAnalysisResult } from "../services/resume.api";

// Inline SVG icons with className support
const SparklesIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const SearchIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SpellCheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FileCheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const LoaderIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className + " animate-spin"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const CheckCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LightbulbIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

interface AssistantPanelProps {
  resumeId: string;
  tips: string[];
  score: number;
  onAction?: (action: string) => void;
  aiData?: AIAnalysisResult | null;
  isAnalyzing?: boolean;
}

type ActionType = "suggestions" | "strengths" | "weaknesses" | "full";

interface ActionState {
  type: ActionType;
  loading: boolean;
  result?: string;
  error?: string;
}

export function AssistantPanel({ resumeId, tips, score, onAction, aiData: externalAiData, isAnalyzing }: AssistantPanelProps) {
  const [activeAction, setActiveAction] = useState<ActionState | null>(null);
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  const [internalAiData, setInternalAiData] = useState<AIAnalysisResult | null>(null);
  
  // Use external AI data if provided, otherwise use internal
  const aiData = externalAiData ?? internalAiData;

  const handleAction = async (type: ActionType) => {
    setActiveAction({ type, loading: true });
    
    try {
      let data = aiData;
      if (!data) {
        const response = await analyzeResumeWithAI(resumeId);
        data = response.data;
        setInternalAiData(data);
      }

      let result = "";
      switch (type) {
        case "suggestions":
          result = "Suggestions:\n• " + data.suggestions.slice(0, 3).join("\n• ");
          break;
        case "strengths":
          result = "Strengths:\n• " + data.strengths.slice(0, 3).join("\n• ");
          break;
        case "weaknesses":
          result = "Areas to Improve:\n• " + data.weaknesses.slice(0, 3).join("\n• ");
          break;
        case "full":
          result = `AI Score: ${data.score}/100\n\nStrengths:\n• ${data.strengths.slice(0, 2).join("\n• ")}\n\nSuggestions:\n• ${data.suggestions.slice(0, 2).join("\n• ")}`;
          break;
      }

      setActiveAction({ type, loading: false, result });
      onAction?.(type);
    } catch {
      setActiveAction({ 
        type, 
        loading: false, 
        error: "AI analysis failed. Using mock data." 
      });
    }
  };

  const actions = [
    {
      id: "suggestions" as ActionType,
      label: "Get Suggestions",
      icon: SparklesIcon,
      description: "AI-powered improvements",
      color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    },
    {
      id: "strengths" as ActionType,
      label: "View Strengths",
      icon: CheckCircleIcon,
      description: "What's working well",
      color: "bg-green-50 text-green-600 hover:bg-green-100",
    },
    {
      id: "weaknesses" as ActionType,
      label: "Improvements",
      icon: AlertCircleIcon,
      description: "Areas to work on",
      color: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    },
    {
      id: "full" as ActionType,
      label: "Full Analysis",
      icon: FileCheckIcon,
      description: "Complete resume review",
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    },
  ];

  const getScoreStatus = (s: number) => {
    if (s >= 80) return { icon: CheckCircleIcon, color: "text-green-600", bg: "bg-green-50" };
    if (s >= 60) return { icon: AlertCircleIcon, color: "text-yellow-600", bg: "bg-yellow-50" };
    return { icon: AlertCircleIcon, color: "text-red-600", bg: "bg-red-50" };
  };

  const status = getScoreStatus(score);
  const StatusIcon = status.icon;

  return (
    <div className="space-y-3 transition-all duration-300">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <SparklesIcon className="w-4 h-4 text-purple-500" />
          AI Assistant
        </h3>
        {isAnalyzing && (
          <span className="text-xs text-blue-600 flex items-center gap-1 animate-pulse">
            <LoaderIcon className="w-3 h-3" />
            Analyzing...
          </span>
        )}
      </div>

      {/* STATUS */}
      <div className={["p-3 rounded-xl shadow-sm text-sm", status.bg].join(" ")}>
        <div className="flex items-center gap-2">
          <StatusIcon className={["w-4 h-4", status.color].join(" ")} />
          <span className={["font-medium", status.color].join(" ")}>
            {score >= 80
              ? "Great Job! Your resume is ATS optimized."
              : score >= 60
              ? "Good progress! Keep improving your resume."
              : "Needs work. Check the suggestions below."}
          </span>
        </div>
      </div>

      {/* STRENGTHS CARD */}
      <div className="bg-green-50 p-3 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircleIcon className="w-4 h-4 text-green-600" />
          <h4 className="font-medium text-green-800">Strengths</h4>
        </div>
        {isAnalyzing ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-3 bg-green-200 rounded w-3/4"></div>
            <div className="h-3 bg-green-200 rounded w-1/2"></div>
          </div>
        ) : aiData?.strengths && aiData.strengths.length > 0 ? (
          <div className="space-y-1">
            {aiData.strengths.slice(0, 2).map((strength, idx) => (
              <p key={idx} className="text-sm text-green-700">• {strength}</p>
            ))}
            {aiData.strengths.length > 2 && (
              <button
                onClick={() => handleAction("strengths")}
                className="text-xs text-green-600 hover:text-green-800 font-medium mt-1"
              >
                View all →
              </button>
            )}
          </div>
        ) : (
          <p className="text-xs text-green-600 italic">Add content to see strengths</p>
        )}
      </div>

      {/* IMPROVEMENTS CARD */}
      <div className="bg-orange-50 p-3 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircleIcon className="w-4 h-4 text-orange-600" />
          <h4 className="font-medium text-orange-800">Improvements</h4>
        </div>
        {isAnalyzing ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-3 bg-orange-200 rounded w-3/4"></div>
            <div className="h-3 bg-orange-200 rounded w-1/2"></div>
          </div>
        ) : aiData?.weaknesses && aiData.weaknesses.length > 0 ? (
          <div className="space-y-1">
            {aiData.weaknesses.slice(0, 2).map((weakness, idx) => (
              <p key={idx} className="text-sm text-orange-700">• {weakness}</p>
            ))}
            <button
              onClick={() => handleAction("weaknesses")}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Fix Now →
            </button>
          </div>
        ) : (
          <p className="text-xs text-orange-600 italic">No improvements needed yet</p>
        )}
      </div>

      {/* SUGGESTIONS CARD */}
      <div className="bg-purple-50 p-3 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200">
        <div className="flex items-center gap-2 mb-2">
          <SparklesIcon className="w-4 h-4 text-purple-600" />
          <h4 className="font-medium text-purple-800">Suggestions</h4>
        </div>
        {isAnalyzing ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-3 bg-purple-200 rounded w-3/4"></div>
            <div className="h-3 bg-purple-200 rounded w-1/2"></div>
          </div>
        ) : aiData?.suggestions && aiData.suggestions.length > 0 ? (
          <div className="space-y-1">
            {aiData.suggestions.slice(0, 2).map((suggestion, idx) => (
              <p key={idx} className="text-sm text-purple-700">• {suggestion}</p>
            ))}
            {aiData.suggestions.length > 2 && (
              <button
                onClick={() => handleAction("suggestions")}
                className="text-xs text-purple-600 hover:text-purple-800 font-medium mt-1"
              >
                View all →
              </button>
            )}
          </div>
        ) : (
          <p className="text-xs text-purple-600 italic">Get AI suggestions to improve</p>
        )}
      </div>

      {/* RESULT OVERLAY */}
      {activeAction && !activeAction.loading && (activeAction.result || activeAction.error) && (
        <div className={[
          "p-4 rounded-xl text-sm shadow-sm transition-all duration-300",
          activeAction.error ? "bg-red-50 text-red-700 border border-red-100" : "bg-gray-50 text-gray-700 border border-gray-200"
        ].join(" ")}>
          <p className="whitespace-pre-line">{activeAction.error || activeAction.result}</p>
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Actions</h4>
        
        <button
          onClick={() => handleAction("full")}
          disabled={activeAction?.type === "full" && activeAction?.loading}
          className={[
            "w-full bg-blue-100 text-blue-700 p-3 rounded-xl flex justify-between items-center cursor-pointer hover:bg-blue-200 hover:shadow-md hover:scale-[1.01] transition-all duration-200 text-sm font-medium",
            activeAction?.type === "full" && activeAction?.loading ? "opacity-70" : ""
          ].join(" ")}
        >
          <span className="flex items-center gap-2">
            <FileCheckIcon className="w-4 h-4" />
            Full Analysis
          </span>
          <span className="text-blue-500">›</span>
        </button>
      </div>

      {/* TIPS */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
          <LightbulbIcon />
          Tips & Suggestions
        </h4>
        <div className="bg-gray-50 p-3 rounded-xl space-y-2 border border-gray-100">
          {tips.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No suggestions at this time.</p>
          ) : (
            tips.map((tip, idx) => (
              <div
                key={idx}
                onClick={() => setExpandedTip(expandedTip === idx ? null : idx)}
                className="text-sm text-gray-600 cursor-pointer hover:text-gray-800 transition-colors flex items-start gap-2"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span className={expandedTip === idx ? "" : "line-clamp-1"}>{tip}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
