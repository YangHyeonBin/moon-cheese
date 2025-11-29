import { http } from '@/utils/http';
import { useQuery } from '@tanstack/react-query';

export type ExchangeRate = {
  KRW: number;
  USD: number;
};

type ExchangeRateResponse = {
  exchangeRate: ExchangeRate;
};

const exchangeQueryKey = ['exchangeRate'] as const;

export const useExchangeRate = () => {
  return useQuery({
    queryKey: exchangeQueryKey,
    queryFn: async () => {
      const response = await http.get<ExchangeRateResponse>('/api/exchange-rate');
      return response.exchangeRate;
    },
    staleTime: 0, // 환율은 매번 최신 정보 패치
  });
};
