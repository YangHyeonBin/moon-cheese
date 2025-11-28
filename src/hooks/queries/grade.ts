import type { Grade } from '@/constants/grade';
import { http } from '@/utils/http';
import { useQuery } from '@tanstack/react-query';

export type GradePoint = {
  type: Grade;
  minPoint: number;
};

type GradePointResponse = {
  gradePointList: GradePoint[];
};

const gradePointQueryKey = ['grade', 'point'] as const;

export const useGradePoint = () => {
  return useQuery({
    queryKey: gradePointQueryKey,
    queryFn: async () => {
      const response = await http.get<GradePointResponse>('/api/grade/point');
      console.log(response);
      return response.gradePointList;
    },
  });
};
