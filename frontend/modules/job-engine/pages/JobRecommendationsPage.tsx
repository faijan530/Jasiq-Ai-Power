import React from 'react';
import { useJobRecommendations } from '../hooks/useJobRecommendations';
import { RecommendedJobCard } from '../components/RecommendedJobCard';
import { EmptyJobState } from '../components/EmptyJobState';

// In a real implementation, you would get this from the user's active resume context
const MOCK_RESUME_ID = "mock-resume-id";

export const JobRecommendationsPage: React.FC = () => {
  const { data: recommendations, isLoading, error } = useJobRecommendations(MOCK_RESUME_ID);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Recommended For You</h1>
        <p className="text-slate-400">Jobs matched specifically to your resume and skills.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-48 animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400">
          Failed to load recommendations. Please try again later.
        </div>
      ) : recommendations && recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((item) => (
            <RecommendedJobCard key={item.job.id} recommendedJob={item} />
          ))}
        </div>
      ) : (
        <EmptyJobState />
      )}
    </div>
  );
};
