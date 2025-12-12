import type { CartItem } from '@/providers/ShoppingCartProvider';
import type { Product } from '@/remotes/product';

/**
 * Remote 상태인 제품의 재고(stock) 값과 현재 사용자가 장바구니에 담은 양(quantity)를 이용해 더 담을 수 있는 수량을 계산
 */
export const getAvailableStock = (product: Product, cartItems: CartItem[]): number => {
  const cartItem = cartItems.find(item => item.product.id === product.id);
  const cartQuantity = cartItem?.quantity ?? 0;
  return product.stock - cartQuantity;
};
