import { http } from '@/utils/http';
import { useQuery } from '@tanstack/react-query';

type RecentProduct = {
  id: number;
  thumbnail: string;
  name: string;
  price: number;
};

type RecentProductResponse = {
  recentProducts: RecentProduct[];
};

const recentProductQueryKey = ['recent', 'product', 'list'] as const;

export const useRecentProductList = () => {
  return useQuery({
    queryKey: recentProductQueryKey,
    queryFn: async () => http.get<RecentProductResponse>('/api/recent/product/list'),
  });
};
