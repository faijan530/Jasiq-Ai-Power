interface SkillTagProps {
  name: string;
  level: "major" | "minor";
  demand?: "high" | "medium" | "low";
}

export const SkillTag = ({ name, level, demand = "medium" }: SkillTagProps) => {
  const levelStyles = {
    major: "bg-red-100 text-red-700 border-red-200",
    minor: "bg-amber-100 text-amber-700 border-amber-200",
  };

  const demandIndicator = {
    high: "• High Demand",
    medium: "• Medium",
    low: "",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${levelStyles[level]}`}
    >
      <span>{name}</span>
      {demand !== "low" && (
        <span className="text-xs opacity-75">{demandIndicator[demand]}</span>
      )}
    </div>
  );
};

export default SkillTag;
