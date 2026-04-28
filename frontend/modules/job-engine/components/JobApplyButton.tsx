import React from 'react';

interface JobApplyButtonProps {
  applyLink: string | null;
  className?: string;
}

export const JobApplyButton: React.FC<JobApplyButtonProps> = ({ applyLink, className = "" }) => {
  if (!applyLink) return null;

  return (
    <a
      href={applyLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-colors ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      Apply Now
      <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
};
