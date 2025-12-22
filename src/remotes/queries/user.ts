import { queryOptions } from '@tanstack/react-query';
import { getMe } from '../user';

/**
 * 유저 쿼리 옵션
 */
export const userQueries = {
  me: () =>
    queryOptions({
      queryKey: ['me'],
      queryFn: getMe,
    }),
};
