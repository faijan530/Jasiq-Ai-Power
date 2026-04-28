import React from 'react';
import { JobFilters } from '../types/job.filters';

interface JobFilterBarProps {
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
}

export const JobFilterBar: React.FC<JobFilterBarProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 w-64 shrink-0">
      <h3 className="text-lg font-semibold text-slate-100 mb-6 border-b border-slate-800 pb-4">Filters</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Job Type</label>
          <select 
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
            value={filters.type || ''}
            onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
          >
            <option value="">Any Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Experience (Years)</label>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Min" 
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
              value={filters.minExperience || ''}
              onChange={(e) => onFilterChange({ ...filters, minExperience: e.target.value ? Number(e.target.value) : undefined })}
            />
            <span className="text-slate-500">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
              value={filters.maxExperience || ''}
              onChange={(e) => onFilterChange({ ...filters, maxExperience: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
        </div>

        <button 
          className="w-full py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          onClick={() => onFilterChange({})}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};
