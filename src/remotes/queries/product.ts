import { queryOptions } from '@tanstack/react-query';
import { getProductList, getRecentProductList } from '../product';

export const productQueries = {
  // 쿼리 키
  all: () => ['product'],
  productListKey: () => [...productQueries.all(), 'list'],
  recentProductListKey: () => [...productQueries.all(), 'recent'],

  // 쿼리 옵션
  recentProductList: () =>
    queryOptions({
      queryKey: productQueries.recentProductListKey(),
      queryFn: getRecentProductList,
    }),

  productList: () =>
    queryOptions({
      queryKey: productQueries.productListKey(),
      queryFn: getProductList,
    }),
};
