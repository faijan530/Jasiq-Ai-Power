import React from 'react';
import { Job } from '../types/job.model';

interface JobDetailBodyProps {
  job: Job;
}

export const JobDetailBody: React.FC<JobDetailBodyProps> = ({ job }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Job Description</h2>
          <div className="prose prose-invert prose-slate max-w-none">
            {/* Simple sanitization via text rendering, assumes basic text for now */}
            <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-sans">
              {job.jdText}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Required Skills</h3>
          {job.skillsRequired && job.skillsRequired.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 text-sm font-medium bg-slate-800 text-slate-300 rounded-lg border border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic text-sm">No specific skills listed.</p>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">About this role</h3>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-slate-500">Posted on</span>
              <span className="font-medium text-slate-300">
                {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'Unknown'}
              </span>
            </li>
            <li className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-slate-500">Source</span>
              <span className="font-medium text-slate-300 capitalize">{job.source?.toLowerCase() || 'Manual'}</span>
            </li>
            <li className="flex justify-between items-center pb-1">
              <span className="text-slate-500">Job ID</span>
              <span className="font-mono text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded truncate max-w-[150px]">
                {job.id}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
