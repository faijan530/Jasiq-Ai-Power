import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../types/job.model';
import { JobSkillsList } from './JobSkillsList';
import { JobExperienceIndicator } from './JobExperienceIndicator';
import { JobBookmarkButton } from './JobBookmarkButton';
import { JobApplyButton } from './JobApplyButton';
import { TenantJobBadge } from './TenantJobBadge';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Link 
      to={`/app/jobs/${job.id}`}
      className="block bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-200 group"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
              {job.title}
            </h3>
            <TenantJobBadge tenantId={job.tenantId} />
          </div>
          <p className="text-slate-400 font-medium">{job.company}</p>
        </div>
        <div className="flex gap-2">
          <JobBookmarkButton jobId={job.id} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-4">
        {job.location && (
          <div className="flex items-center text-sm text-slate-400">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </div>
        )}
        
        {job.employmentType && (
          <div className="flex items-center text-sm text-slate-400">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {job.employmentType}
          </div>
        )}

        <JobExperienceIndicator minExperience={job.minExperience} maxExperience={job.maxExperience} />
      </div>

      <JobSkillsList skills={job.skillsRequired} />

      <div className="mt-5 pt-4 border-t border-slate-800 flex justify-between items-center">
        <div className="text-xs text-slate-500">
          Posted {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'Recently'}
        </div>
        <div className="flex gap-3">
          <JobApplyButton applyLink={job.applyLink} />
        </div>
      </div>
    </Link>
  );
};
