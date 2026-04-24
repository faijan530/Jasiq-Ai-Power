import {
  MessageSquare,
  FileText,
  Sparkles,
  TrendingUp,
  Wand2,
  ChevronRight,
} from "lucide-react";

interface AssistantMenuProps {
  onChatClick?: () => void;
  onOptimizeClick?: () => void;
  onCompareClick?: () => void;
  onTrendsClick?: () => void;
  onEnhanceClick?: () => void;
}

export const AssistantMenu = ({
  onChatClick,
  onOptimizeClick,
  onCompareClick,
  onTrendsClick,
  onEnhanceClick,
}: AssistantMenuProps) => {
  const menuItems = [
    {
      id: "chat",
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Chat Assistant",
      description: "Ask about your resume",
      onClick: onChatClick,
      color: "bg-blue-500",
    },
    {
      id: "optimize",
      icon: <Sparkles className="w-5 h-5" />,
      label: "Optimize Resume",
      description: "AI-powered improvements",
      onClick: onOptimizeClick,
      color: "bg-purple-500",
    },
    {
      id: "compare",
      icon: <FileText className="w-5 h-5" />,
      label: "Compare Versions",
      description: "See what changed",
      onClick: onCompareClick,
      color: "bg-green-500",
    },
    {
      id: "trends",
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Industry Trends",
      description: "Top skills in demand",
      onClick: onTrendsClick,
      color: "bg-amber-500",
    },
    {
      id: "enhance",
      icon: <Wand2 className="w-5 h-5" />,
      label: "Auto Enhance",
      description: "One-click improvements",
      onClick: onEnhanceClick,
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
      <h3 className="font-semibold text-gray-800 mb-3 px-2">AI Assistant</h3>
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div
              className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center text-white`}
            >
              {item.icon}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900 text-sm">{item.label}</p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssistantMenu;
