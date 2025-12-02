import { http } from '@/utils/http';

export type ExchangeRate = {
  KRW: number;
  USD: number;
};

type ExchangeRateResponse = {
  exchangeRate: ExchangeRate;
};

export const getExchangeRate = async () => {
  const response = await http.get<ExchangeRateResponse>('/api/exchange-rate');
  return response.exchangeRate;
};
