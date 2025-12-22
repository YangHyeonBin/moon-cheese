import { queryOptions } from '@tanstack/react-query';
import { getGradePoint, getGradeShippingList } from '../grade';

/**
 * 등급 쿼리 옵션
 */
export const gradeQueries = {
  gradePoint: () =>
    queryOptions({
      queryKey: ['grade', 'point'],
      queryFn: getGradePoint,
    }),

  gradeShipping: () =>
    queryOptions({
      queryKey: ['grade', 'shipping'],
      queryFn: getGradeShippingList,
    }),
};
