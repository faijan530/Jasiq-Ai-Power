import React from 'react';

interface JobBookmarkButtonProps {
  jobId: string;
  isBookmarked?: boolean;
  onToggle?: (jobId: string) => void;
}

export const JobBookmarkButton: React.FC<JobBookmarkButtonProps> = ({ jobId, isBookmarked = false, onToggle }) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle?.(jobId);
      }}
      className={`p-2 rounded-full transition-colors ${
        isBookmarked 
          ? 'text-blue-500 bg-blue-500/10 hover:bg-blue-500/20' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
      aria-label="Bookmark job"
    >
      <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isBookmarked ? 1 : 2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
};
