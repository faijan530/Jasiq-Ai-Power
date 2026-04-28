import React from 'react';

export const LoadingJobFeed: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="w-3/4">
              <div className="h-6 bg-slate-800 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            </div>
            <div className="h-8 w-8 bg-slate-800 rounded-full"></div>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="h-4 bg-slate-800 rounded w-20"></div>
            <div className="h-4 bg-slate-800 rounded w-20"></div>
            <div className="h-4 bg-slate-800 rounded w-20"></div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-6 bg-slate-800 rounded w-16"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
