import { queryOptions } from '@tanstack/react-query';
import { getExchangeRate } from '../exchange';

export const exchangeQueries = {
  // 키
  exchangeRateKey: () => ['exchange-rate'],

  // 실제 쿼리 옵션
  exchangeRate: () =>
    queryOptions({
      queryKey: [...exchangeQueries.exchangeRateKey()],
      queryFn: getExchangeRate,
      staleTime: 0, // 환율은 매번 최신 정보 패치
    }),
};
