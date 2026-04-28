import React from 'react';

interface JobExperienceIndicatorProps {
  minExperience: number | null;
  maxExperience: number | null;
}

export const JobExperienceIndicator: React.FC<JobExperienceIndicatorProps> = ({ minExperience, maxExperience }) => {
  let label = 'Not specified';
  
  if (minExperience !== null && maxExperience !== null) {
    label = `${minExperience} - ${maxExperience} Yrs`;
  } else if (minExperience !== null) {
    label = `${minExperience}+ Yrs`;
  } else if (maxExperience !== null) {
    label = `Up to ${maxExperience} Yrs`;
  }

  return (
    <div className="flex items-center text-sm text-slate-400">
      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      {label}
    </div>
  );
};
