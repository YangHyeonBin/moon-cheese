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
    const existingItem = shoppingCartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      // 수량만 조정
      const newCartItems = shoppingCartItems.map(item =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      );
      setShoppingCartItems(newCartItems);
    } else {
      // 새 아이템 추가
      const newCartItems = [...shoppingCartItems, { product, quantity: quantity }];
      setShoppingCartItems(newCartItems);
    }
  };

  const removeFromShoppingCart = (productId: number, quantity?: number) => {
    const product = shoppingCartItems.find(item => item.product.id === productId);

    if (!product) {
      return;
    }

    const newQuantity = quantity && product.quantity - quantity > 0 ? product.quantity - quantity : 0;
    if (newQuantity === 0) {
      // 아이템 삭제
      const newCartItems = shoppingCartItems.filter(item => item.product.id !== productId);
      setShoppingCartItems(newCartItems);
    } else {
      // 수량만 조정
      const newCartItems = shoppingCartItems.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      );
      setShoppingCartItems(newCartItems);
    }
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
