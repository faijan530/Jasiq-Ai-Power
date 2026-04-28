import { useQuery } from '@tanstack/react-query';
import { jobApi } from '../services/job.api';
import { mapJobResponseToModel } from '../services/job.mapper';
import { JobFilters } from '../types/job.filters';

export const useJobSearch = (filters: JobFilters) => {
  return useQuery({
    queryKey: ['jobs', 'search', filters],
    queryFn: async () => {
      const data = await jobApi.searchJobs(filters);
      return data.map(mapJobResponseToModel);
    },
    staleTime: 5 * 60 * 1000,
    enabled: Object.keys(filters).length > 0,
  });
};
