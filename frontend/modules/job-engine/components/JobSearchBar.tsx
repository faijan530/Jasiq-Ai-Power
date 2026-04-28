import React from 'react';
import { JobFilters } from '../types/job.filters';

interface JobSearchBarProps {
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
}

export const JobSearchBar: React.FC<JobSearchBarProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center shadow-sm mb-6">
      <div className="flex-1 flex items-center px-4 border-r border-slate-800">
        <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by job title, company, or keywords..."
          className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 py-3"
          value={filters.query || ''}
          onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
        />
      </div>
      <div className="flex-1 flex items-center px-4">
        <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          type="text"
          placeholder="City, state, or remote"
          className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 py-3"
          value={filters.location || ''}
          onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
        />
      </div>
      <button 
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors ml-2"
        onClick={() => onFilterChange(filters)}
      >
        Search
      </button>
    </div>
  );
};
