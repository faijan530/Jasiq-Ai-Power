import React from 'react';
import { JobFilters } from '../types/job.filters';

interface JobSearchBarProps {
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
}

export const JobSearchBar: React.FC<JobSearchBarProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 flex flex-col md:flex-row items-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)]">
      <div className="flex-1 w-full flex items-center px-4 md:border-r border-slate-700/50 py-2 md:py-0">
        <svg className="w-5 h-5 text-blue-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by job title, company, or keywords..."
          className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-400 py-3 outline-none"
          value={filters.query || ''}
          onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
        />
      </div>
      
      <div className="flex-1 w-full flex items-center px-4 py-2 md:py-0 border-t md:border-t-0 border-slate-700/50">
        <svg className="w-5 h-5 text-blue-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          type="text"
          placeholder="City, state, or remote"
          className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-400 py-3 outline-none"
          value={filters.location || ''}
          onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
        />
      </div>
      
      <button 
        className="w-full md:w-auto mt-2 md:mt-0 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-200 transform hover:-translate-y-0.5 ml-0 md:ml-2"
        onClick={() => onFilterChange(filters)}
      >
        Search Jobs
      </button>
    </div>
  );
};
