import React from 'react';
import { Link } from 'react-router-dom';
import { RecommendedJob } from '../types/job.model';
import { JobSkillsList } from './JobSkillsList';

interface RecommendedJobCardProps {
  recommendedJob: RecommendedJob;
}

export const RecommendedJobCard: React.FC<RecommendedJobCardProps> = ({ recommendedJob }) => {
  const { job, matchScore } = recommendedJob;
  
  // Determine score color
  let scoreColor = "text-slate-400 bg-slate-800";
  if (matchScore >= 80) scoreColor = "text-green-400 bg-green-400/10 border border-green-400/20";
  else if (matchScore >= 60) scoreColor = "text-yellow-400 bg-yellow-400/10 border border-yellow-400/20";

  return (
    <Link 
      to={`/app/jobs/${job.id}`}
      className="block bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
            {job.title}
          </h3>
          <p className="text-slate-400 font-medium">{job.company}</p>
        </div>
        <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-full font-bold ${scoreColor}`}>
          <span className="text-sm leading-none">{matchScore}</span>
          <span className="text-[10px] leading-none opacity-80">Match</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-4">
        {job.location && (
          <div className="flex items-center text-sm text-slate-400">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </div>
        )}
      </div>

      <JobSkillsList skills={job.skillsRequired} />
    </Link>
  );
};
