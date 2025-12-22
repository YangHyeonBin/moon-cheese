import { useState } from 'react';
import CheckoutSection from './components/CheckoutSection';
import DeliveryMethodSection from './components/DeliveryMethodSection';
import ShoppingCartSection from './components/ShoppingCartSection';
import { useShoppingCartState } from '@/providers/ShoppingCartProvider';
import EmptyCartSection from './components/EmptyCartSection';
import type { DeliveryMethod } from '@/remotes/product';

function ShoppingCartPage() {
  const { cartItems } = useShoppingCartState();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('EXPRESS');

  if (cartItems.length === 0) {
    return <EmptyCartSection />;
  }

  return (
    <>
      <ShoppingCartSection />
      <DeliveryMethodSection deliveryMethod={deliveryMethod} setDeliveryMethod={setDeliveryMethod} />
      <CheckoutSection deliveryMethod={deliveryMethod} />
    </>
  );
}

export default ShoppingCartPage;
