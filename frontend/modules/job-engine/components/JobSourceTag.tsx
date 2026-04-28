import React from 'react';

interface JobSourceTagProps {
  source: string | null;
}

export const JobSourceTag: React.FC<JobSourceTagProps> = ({ source }) => {
  if (!source || source === 'MANUAL') return null;

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-400">
      {source}
    </span>
  );
};
