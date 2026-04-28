import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useJobDetail } from '../hooks/useJobs';
import { JobDetailHeader } from '../components/JobDetailHeader';
import { JobDetailBody } from '../components/JobDetailBody';

export const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { data: job, isLoading, error } = useJobDetail(jobId || '');

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-10 w-32 bg-slate-800 rounded mb-6"></div>
        <div className="h-48 bg-slate-900 border border-slate-800 rounded-xl mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-slate-900 border border-slate-800 rounded-xl"></div>
          <div className="h-96 bg-slate-900 border border-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Job Not Found</h2>
        <p className="text-slate-400 mb-8">The job you're looking for doesn't exist or has been removed.</p>
        <Link to="/app/jobs" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/app/jobs" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-6 font-medium text-sm">
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Jobs
      </Link>
      
      <JobDetailHeader job={job} />
      <JobDetailBody job={job} />
    </div>
  );
};
