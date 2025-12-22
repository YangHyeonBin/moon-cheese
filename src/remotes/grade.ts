import type { Grade } from '@/constants/grade';
import { http } from '@/utils/http';

export const getGradePoint = async () => {
  const response = await http.get<GradePointResponse>('/api/grade/point');
  return response.gradePointList;
};

export const getGradeShippingList = async () => {
  const response = await http.get<GradeShippingResponse>('/api/grade/shipping');
  return response.gradeShippingList;
};

// Type, Interface
export type GradePoint = {
  type: Grade;
  minPoint: number;
};

export type GradeShipping = {
  type: Grade;
  shippingFee: number; // 배송비
  freeShippingThreshold: number; // 배송비 무료 기준 구매금액
};

// DTO
type GradePointResponse = {
  gradePointList: GradePoint[];
};

type GradeShippingResponse = {
  gradeShippingList: GradeShipping[];
};
