import { queryOptions } from '@tanstack/react-query';
import { getProductDetail, getProductList, getRecentProductList } from '../product';

/**
 * Product 쿼리 키
 */
export const productQueryKeys = {
  all: () => ['product'],
  productList: () => [...productQueryKeys.all(), 'list'],
  detail: (productId: string) => [...productQueryKeys.all(), 'detail', productId],

  recentProductList: () => [...productQueryKeys.all(), 'recent'],

  recommendProductList: (productId: string) => [...productQueryKeys.all(), 'recommend', productId],
};

/**
 * Product 쿼리 옵션
 */
export const productQueryOptions = {
  productList: () =>
    queryOptions({
      queryKey: productQueryKeys.productList(),
      queryFn: getProductList,
    }),

  productDetail: (productId: string) =>
    queryOptions({
      queryKey: productQueryKeys.detail(productId),
      queryFn: () => getProductDetail(productId),
    }),

  recentProductList: () =>
    queryOptions({
      queryKey: productQueryKeys.recentProductList(),
      queryFn: getRecentProductList,
    }),

  recommendProductList: (productId: string) =>
    queryOptions({
      queryKey: productQueryKeys.recommendProductList(productId),
      queryFn: () => {},
    }),
};
