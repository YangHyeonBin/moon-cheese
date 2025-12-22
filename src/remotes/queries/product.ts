import { queryOptions } from '@tanstack/react-query';
import { getProductDetail, getProductList, getRecentProductList, getRecommendProductIds } from '../product';

/**
 * Product 쿼리 옵션 - 여기에 키를 바로 정의하고 .queryKey로 접근 가능함!!!
 */
export const productQueries = {
  productList: () =>
    queryOptions({
      queryKey: ['product', 'list'],
      queryFn: getProductList,
    }),

  productDetail: (productId: number) =>
    queryOptions({
      queryKey: ['product', 'detail', productId],
      queryFn: () => getProductDetail(productId),
    }),

  recentProductList: () =>
    queryOptions({
      queryKey: ['product', 'recent'],
      queryFn: getRecentProductList,
    }),

  recommendProductIds: (productId: number) =>
    queryOptions({
      queryKey: ['product', 'recommend', productId],
      queryFn: () => getRecommendProductIds(productId),
    }),
};
