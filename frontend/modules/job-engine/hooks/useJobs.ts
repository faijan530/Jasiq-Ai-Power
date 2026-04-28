import { useQuery } from '@tanstack/react-query';
import { jobApi } from '../services/job.api';
import { mapJobResponseToModel } from '../services/job.mapper';
import { JobFilters } from '../types/job.filters';

export const useJobs = (filters: JobFilters = {}) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const data = await jobApi.getJobs(filters);
      return data.map(mapJobResponseToModel);
    },
    staleTime: 5 * 60 * 1000, // cache jobs -> 5 min
  });
};

export const useJobDetail = (id: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const data = await jobApi.getJobById(id);
      return mapJobResponseToModel(data);
    },
    enabled: !!id,
    staleTime: 20 * 60 * 1000, // job detail -> 20 min
  });
};
