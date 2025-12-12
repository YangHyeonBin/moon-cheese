import { queryOptions } from '@tanstack/react-query';
import { getGradePoint } from '../grade';

export const gradePointQueries = {
  // 쿼리 키
  gradePointKey: () => ['grade', 'point'],

  // 실제 쿼리 옵션
  gradePoint: () =>
    queryOptions({
      queryKey: gradePointQueries.gradePointKey(),
      queryFn: getGradePoint,
    }),
};
