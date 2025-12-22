import type { CartItem } from '@/providers/ShoppingCartProvider';

// 장바구니 담은 총 수량 계산
export const getCartTotalQuantity = (cartItems: CartItem[]): number => {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0);
};

// 장바구니 담은 제품 총 금액 계산
export const calculateCartTotalPrice = (cartItems: CartItem[]): number => {
  const totalPrice = cartItems.reduce((total, cartItem) => {
    const price = cartItem.product.price * cartItem.quantity;
    total += price;

    return total;
  }, 0);

  return totalPrice;
};
