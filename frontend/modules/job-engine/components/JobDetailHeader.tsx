import React from 'react';
import { Job } from '../types/job.model';
import { TenantJobBadge } from './TenantJobBadge';
import { JobExperienceIndicator } from './JobExperienceIndicator';
import { JobBookmarkButton } from './JobBookmarkButton';
import { JobApplyButton } from './JobApplyButton';
import { useNavigate } from 'react-router-dom';

interface JobDetailHeaderProps {
  job: Job;
}

export const JobDetailHeader: React.FC<JobDetailHeaderProps> = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 mb-6 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
        </svg>
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-start gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100">{job.title}</h1>
            <TenantJobBadge tenantId={job.tenantId} />
          </div>
          <p className="text-lg text-blue-400 font-medium mb-4">{job.company}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
            {job.location && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </div>
            )}
            {job.employmentType && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {job.employmentType}
              </div>
            )}
            <JobExperienceIndicator minExperience={job.minExperience} maxExperience={job.maxExperience} />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <JobBookmarkButton jobId={job.id} />
          <button 
            onClick={() => navigate(`/app/jd-match?jobId=${job.id}`)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 font-medium rounded-lg border border-slate-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Evaluate Match
          </button>
          <JobApplyButton applyLink={job.applyLink} className="!py-2" />
        </div>
      </div>
    </div>
  );
};
