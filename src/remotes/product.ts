import type { Category } from '@/constants/category';
import { http } from '@/utils/http';

type RecentProduct = {
  id: number;
  thumbnail: string;
  name: string;
  price: number;
};

type Product = {
  id: number;
  name: string;
  category: Category;
  stock: number;
  price: number;
  description: string;
  detailDescription: string;
  images: string[];
  rating: number;
  isGlutenFree?: boolean;
  isCaffeineFree?: boolean;
};

type RecentProductListResponse = {
  recentProducts: RecentProduct[];
};

type ProductListResponse = {
  products: Product[];
};

export const getRecentProductList = async () => {
  const response = await http.get<RecentProductListResponse>('/api/recent/product/list');
  return response;
};

export const getProductList = async () => {
  const response = await http.get<ProductListResponse>('/api/product/list');
  return response.products;
};
