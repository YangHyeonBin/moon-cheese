import { Flex, Stack, styled } from 'styled-system/jsx';
import { Spacing, Text } from '@/ui-lib';
import { DeliveryIcon, RocketIcon } from '@/ui-lib/components/icons';
import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';
import { gradeQueries } from '@/remotes/queries/grade';
import { useShoppingCartState } from '@/providers/ShoppingCartProvider';
import { getDeliveryFee } from '@/utils/deliveryFee';
import { userQueries } from '@/remotes/queries/user';
import AsyncBoundary from '@/components/AsyncBoundary';
import { useCurrency } from '@/providers/CurrencyProvider';
import { exchangeQueries } from '@/remotes/queries/exchange';
import { formatPrice } from '@/utils/price';
import type { DeliveryMethod } from '@/remotes/product';

const DeliveryMethodSection = ({
  deliveryMethod,
  setDeliveryMethod,
}: {
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
}) => {
  return (
    <AsyncBoundary suspenseFallback={<DeliveryMethodSkeleton />}>
      <DeliveryMethodSectionContainer deliveryMethod={deliveryMethod} setDeliveryMethod={setDeliveryMethod} />
    </AsyncBoundary>
  );
};

function DeliveryMethodSectionContainer({
  deliveryMethod,
  setDeliveryMethod,
}: {
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
}) {
  const [{ data: me }, { data: gradeShippingList }] = useSuspenseQueries({
    queries: [userQueries.me(), gradeQueries.gradeShipping()],
  });

  const { cartItems } = useShoppingCartState();

  // 프리미엄일 때의 배송비
  const deliveryFee = getDeliveryFee({ myGrade: me.grade, gradeShippingList, cartItems });

  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Text variant="H2_Bold">배송 방식</Text>

      <Spacing size={4} />

      <Stack gap={4}>
        <DeliveryItem
          title="Express"
          description="3-5일 후 도착 예정"
          icon={<DeliveryIcon size={28} />}
          price={0}
          isSelected={deliveryMethod === 'EXPRESS'}
          onClick={() => setDeliveryMethod('EXPRESS')}
        />
        <DeliveryItem
          title="Premium"
          description="당일 배송"
          icon={<RocketIcon size={28} />}
          price={deliveryFee}
          isSelected={deliveryMethod === 'PREMIUM'}
          onClick={() => setDeliveryMethod('PREMIUM')}
        />
      </Stack>
    </styled.section>
  );
}

function DeliveryItem({
  title,
  description,
  icon,
  price,
  isSelected,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  price: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { currency } = useCurrency();
  const { data: exchangeRate } = useSuspenseQuery(exchangeQueries.exchangeRate());

  return (
    <Flex
      gap={3}
      css={{
        alignItems: 'center',
        p: 5,
        py: 4,
        bgColor: isSelected ? 'primary.01_primary' : 'background.02_light-gray',
        transition: 'background-color 0.3s ease',
        rounded: '2xl',
        color: isSelected ? 'neutral.05_white' : 'neutral.01_black',
        cursor: 'pointer',
      }}
      role="button"
      onClick={onClick}
    >
      {icon}

      <Flex flexDir="column" gap={1} flex={1}>
        <Text variant="B2_Regular" fontWeight={'semibold'} color={isSelected ? 'neutral.05_white' : 'neutral.01_black'}>
          {title}
        </Text>
        <Text variant="C2_Medium" color={isSelected ? 'neutral.05_white' : 'neutral.02_gray'}>
          {description}
        </Text>
      </Flex>
      <Text variant="B2_Medium" fontWeight={'semibold'} color={isSelected ? 'neutral.05_white' : 'neutral.01_black'}>
        {price ? `${formatPrice(price, currency, exchangeRate)}` : '무료'}
      </Text>
    </Flex>
  );
}

const DeliveryMethodSkeleton = () => (
  <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
    {/* 헤더 */}
    <styled.div
      css={{
        w: '90px',
        h: '24px',
        rounded: 'md',
        bg: 'background.02_light-gray',
        animation: 'skeleton-pulse',
      }}
    />

    <Spacing size={4} />

    <Stack gap={4}>
      <DeliveryItemSkeleton />
      <DeliveryItemSkeleton />
    </Stack>
  </styled.section>
);

const DeliveryItemSkeleton = () => (
  <Flex
    gap={3}
    css={{
      alignItems: 'center',
      p: 5,
      py: 4,
      bgColor: 'background.02_light-gray',
      rounded: '2xl',
    }}
  >
    {/* 아이콘 */}
    <styled.div
      css={{
        w: '28px',
        h: '28px',
        rounded: 'md',
        bg: 'neutral.04_light-gray',
        animation: 'skeleton-pulse',
      }}
    />

    {/* 제목 + 설명 */}
    <Flex flexDir="column" gap={1} flex={1}>
      <styled.div
        css={{ w: '60px', h: '18px', rounded: 'md', bg: 'neutral.04_light-gray', animation: 'skeleton-pulse' }}
      />
      <styled.div
        css={{ w: '90px', h: '14px', rounded: 'md', bg: 'neutral.04_light-gray', animation: 'skeleton-pulse' }}
      />
    </Flex>

    {/* 가격 */}
    <styled.div
      css={{ w: '50px', h: '18px', rounded: 'md', bg: 'neutral.04_light-gray', animation: 'skeleton-pulse' }}
    />
  </Flex>
);

export default DeliveryMethodSection;
