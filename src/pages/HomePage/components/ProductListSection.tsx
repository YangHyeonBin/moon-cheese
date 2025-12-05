import { Counter, SubGNB, Text } from '@/ui-lib';
import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Grid, Stack, styled } from 'styled-system/jsx';
import ProductItem from '../components/ProductItem';
import { productQueries } from '@/remotes/queries/product';
import { useSuspenseQueries } from '@tanstack/react-query';
import { ErrorBoundary } from '@suspensive/react';
import ErrorSection from '@/components/ErrorSection';
import type { Product } from '@/remotes/product';
import { useCurrency } from '@/providers/CurrencyProvider';
import { exchangeQueries } from '@/remotes/queries/exchange';
import { formatPrice } from '@/utils/price';

// 태그 컴포넌트 조건부 렌더링 함수
function renderFreeTags(product: Product) {
  switch (product.category) {
    case 'CHEESE':
      return null;
    case 'CRACKER':
      return product.isGlutenFree && <ProductItem.FreeTag type="gluten" />;
    case 'TEA':
      return product.isCaffeineFree && <ProductItem.FreeTag type="caffeine" />;
    default: {
      const _exhaustiveCheck: never = product; // 처리되지 않은 타입이 있을 경우 경고 띄우기 위함
      return _exhaustiveCheck;
    }
  }
}

// 스켈레톤 컴포넌트
const ProductListSkeleton = () => {
  return (
    <styled.section bg="background.01_white">
      <Box css={{ px: 5, pt: 5, pb: 4 }}>
        <Text variant="H1_Bold">판매 중인 상품</Text>
      </Box>
      {/* gnb 생략 */}
      <Grid gridTemplateColumns="repeat(2, 1fr)" rowGap={9} columnGap={4} p={5}>
        {[1, 2, 3, 4].map(i => (
          <Stack key={i}>
            {/* 이미지 */}
            <styled.div
              css={{
                w: '100%',
                aspectRatio: '1',
                rounded: 'xl',
                bg: 'background.02_light-gray',
                animation: 'skeleton-pulse',
              }}
            />
            {/* 제목 */}
            <styled.div
              css={{ w: '80%', h: '20px', rounded: 'md', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
            />
            {/* 설명 */}
            <styled.div
              css={{
                w: '60%',
                h: '16px',
                rounded: 'md',
                bg: 'background.02_light-gray',
                animation: 'skeleton-pulse',
              }}
            />

            {/* 별점 + 가격 */}
            <Stack justify="space-between">
              <styled.div
                css={{
                  w: '50px',
                  h: '16px',
                  rounded: 'md',
                  bg: 'background.02_light-gray',
                  animation: 'skeleton-pulse',
                }}
              />
              <styled.div
                css={{
                  w: '40%',
                  h: '20px',
                  rounded: 'md',
                  bg: 'background.02_light-gray',
                  animation: 'skeleton-pulse',
                }}
              />
            </Stack>
            {/* 카운터 */}
            <styled.div
              css={{
                w: '100%',
                h: '36px',
                rounded: 'lg',
                bg: 'background.02_light-gray',
                animation: 'skeleton-pulse',
              }}
            />
          </Stack>
        ))}
      </Grid>
    </styled.section>
  );
};

// 데이터 패칭 컨테이너
const ProductListSectionContainer = () => {
  const [currentTab, setCurrentTab] = useState('all');
  const navigate = useNavigate();

  const { currency } = useCurrency();
  const [{ data: productList }, { data: exchangeRate }] = useSuspenseQueries({
    queries: [productQueries.productList(), exchangeQueries.exchangeRate()],
  });

  const handleClickProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <styled.section bg="background.01_white">
      <Box css={{ px: 5, pt: 5, pb: 4 }}>
        <Text variant="H1_Bold">판매 중인 상품</Text>
      </Box>
      <SubGNB.Root value={currentTab} onValueChange={details => setCurrentTab(details.value)}>
        <SubGNB.List>
          <SubGNB.Trigger value="all">전체</SubGNB.Trigger>
          <SubGNB.Trigger value="cheese">치즈</SubGNB.Trigger>
          <SubGNB.Trigger value="cracker">크래커</SubGNB.Trigger>
          <SubGNB.Trigger value="tea">티</SubGNB.Trigger>
        </SubGNB.List>
      </SubGNB.Root>
      <Grid gridTemplateColumns="repeat(2, 1fr)" rowGap={9} columnGap={4} p={5}>
        {productList.map(product => (
          <ProductItem.Root key={product.id} onClick={() => handleClickProduct(product.id)}>
            {product.images.length > 0 && <ProductItem.Image src={product.images[0]} alt={product.name} />}
            <ProductItem.Info title={product.name} description={product.description} />
            <ProductItem.Meta>
              <ProductItem.MetaLeft>
                <ProductItem.Rating rating={product.rating} />
                <ProductItem.Price>{formatPrice(product.price, currency, exchangeRate)}</ProductItem.Price>
              </ProductItem.MetaLeft>
              {renderFreeTags(product)}
            </ProductItem.Meta>
            <Counter.Root>
              <Counter.Minus onClick={() => {}} disabled={true} />
              <Counter.Display value={product.stock} />
              <Counter.Plus onClick={() => {}} />
            </Counter.Root>
          </ProductItem.Root>
        ))}
      </Grid>
    </styled.section>
  );
};

const ProductListSection = ErrorBoundary.with(
  {
    fallback: ({ reset }) => <ErrorSection onRetry={reset} />,
  },
  () => (
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductListSectionContainer />
    </Suspense>
  )
);

export default ProductListSection;
