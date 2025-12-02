import type { Grade } from '@/constants/grade';
import { http } from '@/utils/http';

export type GradePoint = {
  type: Grade;
  minPoint: number;
};

type GradePointResponse = {
  gradePointList: GradePoint[];
};

export const getGradePoint = async () => {
  const response = await http.get<GradePointResponse>('/api/grade/point');
  return response.gradePointList;
};
