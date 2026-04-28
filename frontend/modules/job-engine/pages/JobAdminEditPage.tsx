import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobDetail } from '../hooks/useJobs';
import { useUpdateJob } from '../hooks/useJobAdmin';
import { CreateJobDto } from '../types/job.dto';

export const JobAdminEditPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  const { data: job, isLoading, error } = useJobDetail(jobId || '');
  const updateJob = useUpdateJob(jobId || '');
  
  const [formData, setFormData] = useState<Partial<CreateJobDto>>({});
  const [skillsInput, setSkillsInput] = useState('');

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        company: job.company,
        location: job.location || '',
        employmentType: job.employmentType || 'Full-time',
        skillsRequired: job.skillsRequired || [],
        minExperience: job.minExperience || undefined,
        maxExperience: job.maxExperience || undefined,
        jdText: job.jdText,
        applyLink: job.applyLink || ''
      });
    }
  }, [job]);

  const handleSkillAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillsInput.trim()) {
      e.preventDefault();
      const currentSkills = formData.skillsRequired || [];
      if (!currentSkills.includes(skillsInput.trim())) {
        setFormData({ ...formData, skillsRequired: [...currentSkills, skillsInput.trim()] });
      }
      setSkillsInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skillsRequired: (formData.skillsRequired || []).filter(s => s !== skillToRemove)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateJob.mutate(formData, {
      onSuccess: () => {
        navigate('/admin/jobs');
      }
    });
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse text-slate-400">Loading job details...</div>;
  }

  if (error || !job) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-red-400">Error loading job or job not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Job: {job.title}</h1>
        <p className="text-gray-500">Update job details and requirements.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
              <input 
                type="text" 
                required
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                value={formData.title || ''}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
              <input 
                type="text" 
                required
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                value={formData.company || ''}
                onChange={e => setFormData({...formData, company: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input 
                type="text" 
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                value={formData.location || ''}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
              <select 
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                value={formData.employmentType || ''}
                onChange={e => setFormData({...formData, employmentType: e.target.value})}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Experience (Years)</label>
              <input 
                type="number" 
                min="0"
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                value={formData.minExperience === null ? '' : formData.minExperience}
                onChange={e => setFormData({...formData, minExperience: e.target.value ? Number(e.target.value) : undefined})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Experience (Years)</label>
              <input 
                type="number" 
                min="0"
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                value={formData.maxExperience === null ? '' : formData.maxExperience}
                onChange={e => setFormData({...formData, maxExperience: e.target.value ? Number(e.target.value) : undefined})}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Apply Link</label>
            <input 
              type="url" 
              className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
              value={formData.applyLink || ''}
              onChange={e => setFormData({...formData, applyLink: e.target.value})}
              placeholder="https://example.com/apply"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills & Description</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
            <div className="bg-white border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-shadow">
              <div className="flex flex-wrap gap-2 mb-2">
                {(formData.skillsRequired || []).map(skill => (
                  <span key={skill} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm bg-blue-50 text-blue-700 border border-blue-200">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="ml-1.5 text-blue-500 hover:text-blue-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                  </span>
                ))}
              </div>
              <input 
                type="text" 
                placeholder="Type a skill and press Enter..."
                className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 p-0"
                value={skillsInput}
                onChange={e => setSkillsInput(e.target.value)}
                onKeyDown={handleSkillAdd}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
            <textarea 
              required
              rows={10}
              className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 font-sans"
              value={formData.jdText || ''}
              onChange={e => setFormData({...formData, jdText: e.target.value})}
              placeholder="Detailed job description..."
            />
            {(formData.jdText || '').length > 0 && (formData.jdText || '').length < 50 && (
              <p className="text-red-500 text-xs mt-1">Description must be at least 50 characters.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-gray-200 pt-6">
          <button 
            type="button"
            onClick={() => navigate('/admin/jobs')}
            className="px-6 py-2.5 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors border border-gray-300"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={updateJob.isPending || (formData.jdText || '').length < 50}
            className="px-6 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateJob.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
