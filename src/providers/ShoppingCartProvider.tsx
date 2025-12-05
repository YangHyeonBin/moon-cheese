import type { Product } from '@/remotes/product';
import { createContext, useContext, useState, type ReactNode } from 'react';

type CartItem = {
  product: Product;
  quantity: number;
};

type ShoppingCartState = {
  items: CartItem[];
};

type ShoppingCartActions = {
  addToShoppingCart: (product: Product, quantity?: number) => void; // 수량 넘기지 않을 경우 기본 동작: 1개 추가
  removeFromShoppingCart: (productId: number, quantity?: number) => void; // 수량 넘기지 않을 경우 기본 동작: 전체 삭제
};

// States
const shoppingCartContext = createContext<ShoppingCartState>({
  items: [],
});

// Actions
const shoppingCartActionContext = createContext<ShoppingCartActions>({
  addToShoppingCart: () => {},
  removeFromShoppingCart: () => {},
});

const ShoppingCartProvider = ({ children }: { children: ReactNode }) => {
  const [shoppingCartItems, setShoppingCartItems] = useState<CartItem[]>([]);

  const addToShoppingCart = (product: Product, quantity = 1) => {
    setShoppingCartItems(prev => {
      const existingItem = shoppingCartItems.find(item => item.product.id === product.id);

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
  };

  const removeFromShoppingCart = (productId: number, quantity?: number) => {
    setShoppingCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === productId);

      if (!existingItem) {
        return prev;
      }

      const newQuantity = quantity ? existingItem.quantity - quantity : 0;

      if (newQuantity > 0) {
        // 수량만 조정
        return prev.map(item => (item.product.id === productId ? { ...item, quantity: newQuantity } : item));
      } else {
        // 아이템 삭제
        return prev.filter(item => item.product.id !== productId);
      }
    });
  };

  return (
    <shoppingCartContext.Provider value={{ items: shoppingCartItems }}>
      <shoppingCartActionContext.Provider value={{ addToShoppingCart, removeFromShoppingCart }}>
        {children}
      </shoppingCartActionContext.Provider>
    </shoppingCartContext.Provider>
  );
};

const useShoppingCart = () => {
  return useContext(shoppingCartContext);
};

const useSetShoppingCart = () => {
  return useContext(shoppingCartActionContext);
};

export { ShoppingCartProvider, useShoppingCart, useSetShoppingCart };
