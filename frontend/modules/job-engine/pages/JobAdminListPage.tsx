import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { JobFilters } from '../types/job.filters';
import { Plus, Edit, Briefcase, MapPin, Building, Calendar } from 'lucide-react';

export const JobAdminListPage: React.FC = () => {
  const navigate = useNavigate();
  // Fetch jobs for the admin's tenant (or all if SYSTEM)
  // For now, useJobs fetches the list. Since the backend handles RBAC/Tenancy, 
  // calling /jobs as an admin returns the jobs they have access to.
  const { data: jobs, isLoading, error } = useJobs({});

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Jobs</h1>
          <p className="text-gray-500">Create and manage job postings for your students.</p>
        </div>
        <Link 
          to="/admin/jobs/create" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-white border border-gray-100 rounded-xl shadow-sm"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
          Failed to load jobs. Please try again.
        </div>
      ) : jobs && jobs.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4 hidden md:table-cell">Location / Type</th>
                  <th className="px-6 py-4 hidden lg:table-cell">Posted Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 text-sm">{job.title}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <Briefcase className="w-3 h-3 mr-1" /> 
                        {job.id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <Building className="w-4 h-4 mr-2 text-gray-400" />
                        {job.company}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-700 flex items-center mb-1">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {job.location || 'Not specified'}
                      </div>
                      {job.employmentType && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {job.employmentType}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="text-sm text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/jobs/${job.id}/edit`)}
                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-md transition-colors border border-gray-200"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            Start adding job opportunities for your students to match their resumes against.
          </p>
          <Link 
            to="/admin/jobs/create" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post First Job
          </Link>
        </div>
      )}
    </div>
  );
};
