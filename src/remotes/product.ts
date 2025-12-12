import type { Category } from '@/constants/category';
import { http } from '@/utils/http';

interface ProductBase {
  id: number;
  name: string;
  category: Category;
  stock: number;
  price: number;
  description: string;
  detailDescription: string;
  images: string[];
  rating: number;
}

interface CheeseProduct extends ProductBase {
  category: 'CHEESE';
}

interface CrackerProduct extends ProductBase {
  category: 'CRACKER';
  isGlutenFree?: boolean;
}

interface TeaProduct extends ProductBase {
  category: 'TEA';
  isCaffeineFree?: boolean;
}

type RecentProduct = {
  id: number;
  thumbnail: string;
  name: string;
  price: number;
};

export type Product = CheeseProduct | CrackerProduct | TeaProduct;

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
