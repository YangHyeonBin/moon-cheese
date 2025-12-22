import type { Product } from '@/remotes/product';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type CartItem = {
  product: Product;
  quantity: number;
};

type ShoppingCartState = {
  cartItems: CartItem[];
};

type ShoppingCartActions = {
  addToShoppingCart: (product: Product, quantity?: number) => void; // 수량 넘기지 않을 경우 기본 동작: 1개 추가

  removeFromShoppingCart: (productId: number) => void; // 1개 제거
  deleteFromShoppingCart: (productId: number) => void; // 전체 수량 제거 (삭제)

  clearShoppingCart: () => void; // 장바구니 전체 비우기
};

// State, Action을 분리하여 정의함으로써, 액션만 사용하는 컴포넌트는 State가 변경되어도 리렌더링되지 않도록 설계
// States
const shoppingCartContext = createContext<ShoppingCartState>({
  cartItems: [],
});

// Actions
const shoppingCartActionContext = createContext<ShoppingCartActions>({
  addToShoppingCart: () => {},

  removeFromShoppingCart: () => {},
  deleteFromShoppingCart: () => {},

  clearShoppingCart: () => {},
});

const ShoppingCartProvider = ({ children }: { children: ReactNode }) => {
  const [shoppingCartItems, setShoppingCartItems] = useState<CartItem[]>([]);

  const addToShoppingCart = useCallback((product: Product, quantity = 1) => {
    setShoppingCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);

      if (existingItem) {
        // 수량만 조정
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        // 새 아이템 추가
        return [...prev, { product, quantity }];
      }
    });
  }, []);

  // 2회차 코멘트: 수량 조정, 아이템 삭제 2개를 하고 있으니 분리하는 것도 좋다. -> 테스트 코드 짜기 어려운지를 기준으로 삼아보기
  // 수량 1개 제거 역할만
  const removeFromShoppingCart = useCallback((productId: number) => {
    setShoppingCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === productId);

      if (!existingItem) {
        return prev;
      }

      if (existingItem.quantity > 1) {
        return prev.map(item =>
          item.product.id === productId ? { ...item, quantity: existingItem.quantity - 1 } : item
        );
      } else {
        return prev.filter(item => item.product.id !== productId);
      }
    });
  }, []);

  // 아이템 삭제 역할만
  const deleteFromShoppingCart = useCallback((productId: number) => {
    setShoppingCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === productId);

      if (!existingItem) {
        return prev;
      }

      return prev.filter(item => item.product.id !== productId);
    });
  }, []);

  const clearShoppingCart = useCallback(() => {
    setShoppingCartItems([]);
  }, []);

  const actions = useMemo(
    () => ({
      addToShoppingCart,
      removeFromShoppingCart,
      deleteFromShoppingCart,
      clearShoppingCart,
    }),
    [addToShoppingCart, clearShoppingCart, deleteFromShoppingCart, removeFromShoppingCart]
  );

  return (
    <shoppingCartContext.Provider value={{ cartItems: shoppingCartItems }}>
      <shoppingCartActionContext.Provider value={actions}>{children}</shoppingCartActionContext.Provider>
    </shoppingCartContext.Provider>
  );
};

const useShoppingCartState = () => {
  return useContext(shoppingCartContext);
};

const useShoppingCartActions = () => {
  return useContext(shoppingCartActionContext);
};

export { ShoppingCartProvider, useShoppingCartState, useShoppingCartActions };
