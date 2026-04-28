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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Find Your Next Role</h1>
        <p className="text-slate-400">Discover opportunities that match your skills and experience.</p>
      </div>

      <JobSearchBar filters={filters} onFilterChange={handleFilterChange} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-auto">
          <JobFilterBar filters={filters} onFilterChange={handleFilterChange} />
        </div>
        
        <div className="flex-1 w-full">
          {isLoading ? (
            <LoadingJobFeed />
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400">
              Failed to load jobs. Please try again later.
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <EmptyJobState />
          )}
        </div>
      </div>
    </div>
  );
};
