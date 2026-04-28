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
      className="block relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 hover:border-blue-500/30 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] transition-all duration-300 group overflow-hidden"
    >
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-indigo-400 transition-all duration-300">
              {job.title}
            </h3>
            <TenantJobBadge tenantId={job.tenantId} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium flex items-center">
              {/* Optional: Company logo placeholder */}
              <div className="w-5 h-5 rounded bg-slate-700 flex items-center justify-center mr-2 text-xs font-bold text-slate-300">
                {job.company.charAt(0)}
              </div>
              {job.company}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <JobBookmarkButton jobId={job.id} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-y-3 gap-x-5 mb-5 bg-slate-900/30 p-3 rounded-xl border border-slate-800/50">
        {job.location && (
          <div className="flex items-center text-sm text-slate-300">
            <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </div>
        )}
        
        {job.employmentType && (
          <div className="flex items-center text-sm text-slate-300">
            <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {job.employmentType}
          </div>
        )}

        <JobExperienceIndicator minExperience={job.minExperience} maxExperience={job.maxExperience} />
      </div>

      <div className="mb-2">
        <JobSkillsList skills={job.skillsRequired} />
      </div>

      <div className="mt-6 pt-5 border-t border-slate-700/50 flex justify-between items-center">
        <div className="text-sm text-slate-500 flex items-center">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Posted {job.postedAt ? new Date(job.postedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently'}
        </div>
        <div className="flex gap-3 relative z-10" onClick={(e) => e.stopPropagation()}>
          <JobApplyButton applyLink={job.applyLink} />
        </div>
      </div>
    </Link>
  );
};
