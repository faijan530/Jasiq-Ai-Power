import React from 'react';
import { JobFilters } from '../types/job.filters';

interface JobFilterBarProps {
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
}

export const JobFilterBar: React.FC<JobFilterBarProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 w-full shadow-lg">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
        <h3 className="text-lg font-semibold text-slate-100">Filters</h3>
        <button 
          className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          onClick={() => onFilterChange({})}
        >
          Reset All
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2.5">Job Type</label>
          <div className="relative">
            <select 
              className="w-full bg-slate-900/50 border border-slate-700/50 text-slate-200 rounded-xl p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer"
              value={filters.type || ''}
              onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
            >
              <option value="">Any Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2.5">Experience (Years)</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input 
                type="number" 
                placeholder="Min" 
                min="0"
                className="w-full bg-slate-900/50 border border-slate-700/50 text-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-center"
                value={filters.minExperience || ''}
                onChange={(e) => onFilterChange({ ...filters, minExperience: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
            <span className="text-slate-500 font-medium">-</span>
            <div className="relative flex-1">
              <input 
                type="number" 
                placeholder="Max" 
                min="0"
                className="w-full bg-slate-900/50 border border-slate-700/50 text-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-center"
                value={filters.maxExperience || ''}
                onChange={(e) => onFilterChange({ ...filters, maxExperience: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
