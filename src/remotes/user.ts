import type { Grade } from '@/constants/grade';
import { http } from '@/utils/http';

export type MeResponse = {
  point: number;
  grade: Grade;
};

export const getMe = async () => await http.get<MeResponse>('/api/me');
