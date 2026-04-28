import React from 'react';

interface JobSkillsListProps {
  skills: string[];
}

export const JobSkillsList: React.FC<JobSkillsListProps> = ({ skills }) => {
  if (!skills || skills.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {skills.slice(0, 5).map((skill, index) => (
        <span
          key={index}
          className="px-2 py-1 text-xs font-medium bg-slate-800 text-slate-300 rounded-md border border-slate-700"
        >
          {skill}
        </span>
      ))}
      {skills.length > 5 && (
        <span className="px-2 py-1 text-xs font-medium bg-slate-800/50 text-slate-400 rounded-md border border-slate-700/50">
          +{skills.length - 5}
        </span>
      )}
    </div>
  );
};
