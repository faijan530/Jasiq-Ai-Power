import React, { useState } from 'react';
import { useJobs } from '../hooks/useJobs';
import { JobFilters } from '../types/job.filters';
import { JobCard } from '../components/JobCard';
import { JobSearchBar } from '../components/JobSearchBar';
import { JobFilterBar } from '../components/JobFilterBar';
import { LoadingJobFeed } from '../components/LoadingJobFeed';
import { EmptyJobState } from '../components/EmptyJobState';

export const JobFeedPage: React.FC = () => {
  const [filters, setFilters] = useState<JobFilters>({});
  const { data: jobs, isLoading, error } = useJobs(filters);

  const handleFilterChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 border-b border-slate-800/60 pt-16 pb-12">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute top-12 right-12 w-80 h-80 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-4 tracking-tight">
              Find Your Next Role
            </h1>
            <p className="text-lg text-slate-400 font-medium">
              Discover premium opportunities that match your skills, experience, and career aspirations.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <JobSearchBar filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24">
            <JobFilterBar filters={filters} onFilterChange={handleFilterChange} />
          </div>
          
          <div className="flex-1 w-full min-w-0">
            {isLoading ? (
              <LoadingJobFeed />
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-400 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Failed to load jobs. Please try again later.
              </div>
            ) : jobs && jobs.length > 0 ? (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end mb-4 px-1">
                  <h2 className="text-xl font-semibold text-slate-200">
                    Recommended Jobs <span className="text-slate-500 text-sm font-normal ml-2">({jobs.length} results)</span>
                  </h2>
                </div>
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
                <EmptyJobState />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
