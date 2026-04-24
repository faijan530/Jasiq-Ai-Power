import { useState } from "react";
import { AlertTriangle, AlertCircle, Target } from "lucide-react";
import { SkillTag } from "./SkillTag";
import { GapSkill } from "../types/ats.dto";

interface GapAnalysisProps {
  gapSkills: GapSkill[];
}

export const GapAnalysis = ({ gapSkills }: GapAnalysisProps) => {
  const [activeTab, setActiveTab] = useState<"major" | "minor">("major");

  const majorGaps = gapSkills.filter((skill) => skill.level === "major");
  const minorGaps = gapSkills.filter((skill) => skill.level === "minor");

  const tabs = [
    {
      id: "major" as const,
      label: "Major Gaps",
      count: majorGaps.length,
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
      id: "minor" as const,
      label: "Minor Gaps",
      count: minorGaps.length,
      icon: <AlertCircle className="w-4 h-4" />,
    },
  ];

  const currentSkills = activeTab === "major" ? majorGaps : minorGaps;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-red-500" />
        <h3 className="font-semibold text-gray-800">Gap Analysis</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.icon}
            {tab.label}
            <span className="ml-1 text-xs bg-white px-1.5 py-0.5 rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      {currentSkills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {currentSkills.map((skill) => (
            <SkillTag
              key={skill.name}
              name={skill.name}
              level={skill.level}
              demand={skill.demand}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p className="text-sm">
            No {activeTab} gaps found. Great job!
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          High Demand
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Medium
        </div>
      </div>
    </div>
  );
};

export default GapAnalysis;
