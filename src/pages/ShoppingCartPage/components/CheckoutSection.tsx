import { useNavigate } from 'react-router';
import { Box, Divider, Flex, HStack, Stack, styled } from 'styled-system/jsx';
import { Button, Spacing, Text } from '@/ui-lib';
import { toast } from '@/ui-lib/components/toast';
import { useShoppingCartActions, useShoppingCartState } from '@/providers/ShoppingCartProvider';
import { calculateCartTotalPrice, getCartTotalQuantity } from '@/utils/cart';
import { useCurrency } from '@/providers/CurrencyProvider';
import { useMutation, useQueryClient, useSuspenseQueries } from '@tanstack/react-query';
import { exchangeQueries } from '@/remotes/queries/exchange';
import { formatPrice } from '@/utils/price';
import { getDeliveryFee } from '@/utils/deliveryFee';
import { userQueries } from '@/remotes/queries/user';
import { gradeQueries } from '@/remotes/queries/grade';
import { postProductPurchase, type DeliveryMethod } from '@/remotes/product';
import AsyncBoundary from '@/components/AsyncBoundary';

function CheckoutSection({ deliveryMethod }: { deliveryMethod: DeliveryMethod }) {
  return (
    <AsyncBoundary suspenseFallback={<CheckoutSkeleton />}>
      <CheckoutSectionContainer deliveryMethod={deliveryMethod} />
    </AsyncBoundary>
  );
}

function CheckoutSectionContainer({ deliveryMethod }: { deliveryMethod: DeliveryMethod }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [{ data: exchangeRate }, { data: me }, { data: gradeShippingList }] = useSuspenseQueries({
    queries: [exchangeQueries.exchangeRate(), userQueries.me(), gradeQueries.gradeShipping()],
  });
  const { currency } = useCurrency();
  const { cartItems } = useShoppingCartState();
  const { clearShoppingCart } = useShoppingCartActions();

  const deliveryFee =
    deliveryMethod === 'EXPRESS' ? 0 : getDeliveryFee({ myGrade: me.grade, gradeShippingList, cartItems });
  const totalPrice = calculateCartTotalPrice(cartItems) + deliveryFee;

  const { mutateAsync: purchase, isPending } = useMutation({
    // mutationFn의 인자로 받아보기
    mutationFn: () =>
      postProductPurchase({
        deliveryType: deliveryMethod,
        totalPrice,
        items: cartItems.map(item => {
          return { productId: item.product.id, quantity: item.quantity };
        }),
      }),
    onSuccess: async () => {
      // 장바구니 비우기
      clearShoppingCart();

      // 사용자 등급 리패치
      await queryClient.invalidateQueries({ queryKey: userQueries.me().queryKey });
    },
    onError: () => {
      toast.error('결제에 실패했습니다.');
    },
  });

  const onClickPurchase = async () => {
    await purchase();
    toast.success('결제가 완료되었습니다.');
    navigate('/');
  };

  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Text variant="H2_Bold">결제 금액</Text>

      <Spacing size={4} />

      <Stack
        gap={6}
        css={{
          p: 5,
          border: '1px solid',
          borderColor: 'border.01_gray',
          rounded: '2xl',
        }}
      >
        <Stack gap={5}>
          <Box gap={3}>
            <Flex justify="space-between">
              <Text variant="B2_Regular">주문금액({getCartTotalQuantity(cartItems)}개)</Text>
              <Text variant="B2_Bold">{formatPrice(calculateCartTotalPrice(cartItems), currency, exchangeRate)}</Text>
            </Flex>
            <Spacing size={3} />
            <Flex justify="space-between">
              <Text variant="B2_Regular">배송비</Text>
              {deliveryFee === 0 ? (
                <Text variant="B2_Bold" color="state.green">
                  무료배송
                </Text>
              ) : (
                <Text variant="B2_Bold">{formatPrice(deliveryFee, currency, exchangeRate)}</Text>
              )}
            </Flex>
          </Box>

          <Divider color="border.01_gray" />

          <HStack justify="space-between">
            <Text variant="H2_Bold">총 금액</Text>
            <Text variant="H2_Bold">{formatPrice(totalPrice, currency, exchangeRate)}</Text>
          </HStack>
        </Stack>

        <Button fullWidth size="lg" loading={isPending} onClick={onClickPurchase}>
          {isPending ? '결제 중...' : '결제 진행'}
        </Button>

        <Text variant="C2_Regular" color="neutral.03_gray">
          {`우리는 신용카드, 은행 송금, 모바일 결제, 현금을 받아들입니다\n안전한 체크아웃\n귀하의 결제 정보는 암호화되어 안전합니다.`}
        </Text>
      </Stack>
    </styled.section>
  );
}

const CheckoutSkeleton = () => (
  <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
    {/* 헤더 */}
    <styled.div
      css={{
        w: '100px',
        h: '24px',
        rounded: 'md',
        bg: 'background.02_light-gray',
        animation: 'skeleton-pulse',
      }}
    />

    <Spacing size={4} />

    <Stack
      gap={6}
      css={{
        p: 5,
        border: '1px solid',
        borderColor: 'border.01_gray',
        rounded: '2xl',
      }}
    >
      <Stack gap={5}>
        <Box gap={3}>
          <Flex justify="space-between">
            <styled.div
              css={{ w: '90px', h: '18px', rounded: 'md', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
            />
            <styled.div
              css={{ w: '70px', h: '18px', rounded: 'md', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
            />
          </Flex>
          <Spacing size={3} />
          <Flex justify="space-between">
            <styled.div
              css={{ w: '50px', h: '18px', rounded: 'md', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
            />
            <styled.div
              css={{ w: '60px', h: '18px', rounded: 'md', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
            />
          </Flex>
        </Box>

        <Divider color="border.01_gray" />

        <HStack justify="space-between">
          <styled.div
            css={{ w: '70px', h: '24px', rounded: 'md', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
          />
          <styled.div
            css={{ w: '100px', h: '24px', rounded: 'md', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
          />
        </HStack>
      </Stack>

      {/* 버튼 */}
      <styled.div
        css={{
          w: '100%',
          h: '48px',
          rounded: 'lg',
          bg: 'background.02_light-gray',
          animation: 'skeleton-pulse',
        }}
      />

      {/* 안내 텍스트 */}
      <Stack gap={1}>
        <styled.div
          css={{ w: '100%', h: '14px', rounded: 'md', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
        />
        <styled.div
          css={{ w: '80%', h: '14px', rounded: 'md', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
        />
        <styled.div
          css={{ w: '90%', h: '14px', rounded: 'md', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
        />
      </Stack>
    </Stack>
  </styled.section>
);

export default CheckoutSection;
