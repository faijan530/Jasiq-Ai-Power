import React from 'react';

export const EmptyJobState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-slate-200 mb-2">No jobs found</h3>
      <p className="text-slate-400 max-w-sm">
        We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.
      </p>
    </div>
  );
};
