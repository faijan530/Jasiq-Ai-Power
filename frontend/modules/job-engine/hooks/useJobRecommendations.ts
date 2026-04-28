import { useQuery } from '@tanstack/react-query';
import { jobApi } from '../services/job.api';
import { mapRecommendedJobResponseToModel } from '../services/job.mapper';

export const useJobRecommendations = (resumeId: string) => {
  return useQuery({
    queryKey: ['jobs', 'recommend', resumeId],
    queryFn: async () => {
      const data = await jobApi.recommendJobs(resumeId);
      return data.map(mapRecommendedJobResponseToModel);
    },
    enabled: !!resumeId,
    staleTime: 10 * 60 * 1000, // recommendations -> 10 min
  });
};
