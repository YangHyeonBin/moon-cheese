import { type Grade } from '@/constants/grade';
import type { CartItem } from '@/providers/ShoppingCartProvider';
import type { GradeShipping } from '@/remotes/grade';
import { calculateCartTotalPrice } from './cart';

export const getDeliveryFee = ({
  myGrade,
  gradeShippingList,
  cartItems,
}: {
  myGrade: Grade;
  gradeShippingList: GradeShipping[];
  cartItems: CartItem[];
}): number => {
  const myShipping = gradeShippingList.find(s => s.type === myGrade);

  // 사용처에서는 에러를 던질 것을 예상하지 못할 수 있으니 이런 패턴은 주의..
  // 재사용을 위해 Util로 뺀 함수니까
  if (!myShipping) {
    throw new Error(`배송비 정보 없음: ${myGrade}`);
  }

  const totalPrice = calculateCartTotalPrice(cartItems);

  return myShipping.freeShippingThreshold <= totalPrice ? 0 : myShipping.shippingFee;
};
