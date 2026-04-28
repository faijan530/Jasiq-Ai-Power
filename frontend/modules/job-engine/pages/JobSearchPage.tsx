import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useJobSearch } from '../hooks/useJobSearch';
import { JobFilters } from '../types/job.filters';
import { JobCard } from '../components/JobCard';
import { JobSearchBar } from '../components/JobSearchBar';
import { LoadingJobFeed } from '../components/LoadingJobFeed';
import { EmptyJobState } from '../components/EmptyJobState';

export const JobSearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<JobFilters>({});
  
  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (query) {
      setFilters(prev => ({ ...prev, query }));
    }
  }, [searchParams]);

  const { data: jobs, isLoading, error } = useJobSearch(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Search Results</h1>
      </div>

      <JobSearchBar filters={filters} onFilterChange={setFilters} />

      <div className="w-full mt-6">
        {isLoading ? (
          <LoadingJobFeed />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400">
            Failed to search jobs. Please try again later.
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
  );
};
