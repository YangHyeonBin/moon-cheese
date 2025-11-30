import { Flex, styled } from 'styled-system/jsx';
import { Spacing, Text } from '@/ui-lib';
import { useRecentProductList } from '@/hooks/queries/product';
import { isServerError } from '@/utils/error';
import ErrorSection from '@/components/ErrorSection';
import { useExchangeRate } from '@/hooks/queries/exchange';
import { useCurrency } from '@/providers/CurrencyProvider';
import { formatPrice } from '@/utils/price';

export default function RecentPurchaseSection() {
  const { currency } = useCurrency();
  const recentProductListQuery = useRecentProductList();
  const exchangeRateQuery = useExchangeRate();

  const queries = [recentProductListQuery, exchangeRateQuery];

  // const isLoading = queries.some(q => q.isLoading);
  const hasServerError = queries.some(q => q.error && isServerError(q.error));
  const refetchFailed = () => {
    queries.filter(q => q.error && isServerError(q.error)).forEach(q => q.refetch());
  };

  const recentProductList = recentProductListQuery.data;
  const exchangeRate = exchangeRateQuery.data;

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
        {hasServerError ? (
          <ErrorSection onRetry={refetchFailed} />
        ) : !recentProductList ? (
          <RecentPurchaseSkeleton />
        ) : (
          recentProductList.map(product => {
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
          })
        )}
      </Flex>
    </styled.section>
  );
}

function RecentPurchaseSkeleton() {
  return (
    <>
      {[1, 2, 3].map(i => (
        <Flex key={i} css={{ gap: 4 }}>
          {/* 이미지 스켈레톤 */}
          <styled.div
            css={{ w: '60px', h: '60px', rounded: 'xl', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
          />
          <Flex flexDir="column" gap={1}>
            {/* 이름 스켈레톤 */}
            <styled.div
              css={{
                w: '120px',
                h: '20px',
                rounded: 'md',
                bg: 'background.02_light-gray',
                animation: 'skeleton-pulse',
              }}
            ></styled.div>
            {/* 가격 스켈레톤 */}
            <styled.div
              css={{ w: '80px', h: '24px', rounded: 'md', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
            ></styled.div>
          </Flex>
        </Flex>
      ))}
    </>
  );
}
