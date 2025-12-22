// import { useShoppingCartState } from '@/providers/ShoppingCartProvider';
// import type { GradePoint, GradeShipping } from '@/remotes/grade';
// import { gradeQueries } from '@/remotes/queries/grade';
// import { useQueries } from '@tanstack/react-query';

// // 결제 금액별 배송비
// export const useDeliveryFee = (gradePoint: GradePoint, gradeShippingList: GradeShipping[]) => {
//   const { items: cartItems } = useShoppingCartState();
//   const { gradePoint, gradeShippingList, isLoading } = useQueries({
//     queries: [gradeQueries.gradePoint(), gradeQueries.gradeShipping()],
//     combine: ([pointResult, shippingResult]) => {
//       return {
//         gradePoint: pointResult.data,
//         gradeShippingList: shippingResult.data,
//         isLoading: pointResult.isLoading || shippingResult.isLoading,
//       };
//     },
//   });

//   // 로딩 중일 때 얼리 리턴
//   if (isLoading) {
//     return {
//       totalPrice: 0,
//       deliveryFee: 0,
//       isLoading,
//     };
//   }

//   // 결제 총액 계산
//   const totalPrice = cartItems.reduce((total, cartItem) => {
//     const price = cartItem.product.price * cartItem.quantity;
//     total += price;

//     return total;
//   }, 0);

//   // 사용자 등급의 배송비
//   const deliveryFeeByGrade = gradeShippingList.find(shipping => shipping.grade === gradePoint.grade)?.shippingFee;

//   // 최종 배송비
//   const deliveryFee = gradeShippingList.freeShippingThreshold <= totalPrice ? 0 : deliveryFeeByGrade;

//   return {
//     totalPrice,
//     deliveryFee,
//     isLoading,
//   };
// };
