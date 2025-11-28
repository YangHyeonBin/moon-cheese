import type { Grade } from '@/constants/grade';
import { http } from '@/utils/http';
import { useQuery } from '@tanstack/react-query';

export type MeResponse = {
  point: number;
  grade: Grade;
};

const meQueryKey = ['me'] as const;

export const useMe = () => {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: async () => http.get<MeResponse>('/api/me'),
  });
};
