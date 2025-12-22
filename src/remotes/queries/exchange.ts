import { queryOptions } from '@tanstack/react-query';
import { getExchangeRate } from '../exchange';

/**
 * 환율 쿼리 옵션
 */
export const exchangeQueries = {
  exchangeRate: () =>
    queryOptions({
      queryKey: ['exchange-rate'],
      queryFn: getExchangeRate,
      staleTime: 0, // 환율은 매번 최신 정보 패치
    }),
};
