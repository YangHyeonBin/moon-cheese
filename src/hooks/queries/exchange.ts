import { http } from '@/utils/http';
import { useQuery } from '@tanstack/react-query';

type ExchangeRateResponse = {
  exchangeRate: {
    KRW: number;
    USD: number;
  };
};

const exchangeQueryKey = ['exchangeRate'] as const;

export const useExchangeRate = () => {
  return useQuery({
    queryKey: exchangeQueryKey,
    queryFn: () => http.get<ExchangeRateResponse>('/api/exchange-rate'),
    staleTime: 0, // 환율은 매번 최신 정보 패치
  });
};
