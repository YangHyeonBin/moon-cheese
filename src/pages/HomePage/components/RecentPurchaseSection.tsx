import { Flex, styled } from 'styled-system/jsx';
import { Spacing, Text } from '@/ui-lib';
import { useRecentProductList } from '@/hooks/queries/product';
import { Loader } from 'lucide-react';
import { isServerError } from '@/utils/error';
import ErrorSection from '@/components/ErrorSection';
import { useExchangeRate } from '@/hooks/queries/exchange';
import { useCurrency } from '@/providers/CurrencyProvider';
import { formatPrice } from '@/utils/price';

function RecentPurchaseSection() {
  const { currency } = useCurrency();
  const recentProductListQuery = useRecentProductList();
  const exchangeRateQuery = useExchangeRate();

  const queries = [recentProductListQuery, exchangeRateQuery];

  const isLoading = queries.some(q => q.isLoading);
  const hasServerError = queries.some(q => q.error && isServerError(q.error));
  const refetchFailed = () => {
    queries.filter(q => q.error && isServerError(q.error)).forEach(q => q.refetch());
  };

  if (isLoading) {
    return <Loader />;
  }

  if (hasServerError) {
    return <ErrorSection onRetry={refetchFailed} />;
  }

  const recentProductList = recentProductListQuery.data;
  const exchangeRate = exchangeRateQuery.data;

  if (!recentProductList || !exchangeRate) {
    console.warn('조회된 데이터가 없습니다.');
  }

  return (
    <styled.section css={{ px: 5, pt: 4, pb: 8 }}>
      <Text variant="H1_Bold">최근 구매한 상품</Text>

      <Spacing size={4} />

      <Flex
        css={{
          bg: 'background.01_white',
          px: 5,
          py: 4,
          gap: 4,
          rounded: '2xl',
        }}
        direction={'column'}
      >
        {recentProductList?.map(product => {
          return (
            <Flex
              key={product?.id}
              css={{
                gap: 4,
              }}
            >
              <styled.img
                src={product?.thumbnail}
                alt="item"
                css={{
                  w: '60px',
                  h: '60px',
                  objectFit: 'cover',
                  rounded: 'xl',
                }}
              />
              <Flex flexDir="column" gap={1}>
                <Text variant="B2_Medium">{product?.name}</Text>
                <Text variant="H1_Bold">{formatPrice(product?.price, currency, exchangeRate)}</Text>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </styled.section>
  );
}

export default RecentPurchaseSection;
