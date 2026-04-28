import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jobApi } from '../services/job.api';
import { CreateJobDto } from '../types/job.dto';

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobDto) => jobApi.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useUpdateJob = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CreateJobDto>) => jobApi.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', id] });
    },
  });
};
