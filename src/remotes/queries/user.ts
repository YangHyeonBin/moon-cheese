import { queryOptions } from '@tanstack/react-query';
import { getMe } from '../user';

export const userQueries = {
  // 쿼리 키
  meKey: () => ['me'],

  // 쿼리 옵션
  me: () =>
    queryOptions({
      queryKey: userQueries.meKey(),
      queryFn: getMe,
    }),
};
