import { Counter, SubGNB, Text } from '@/ui-lib';
import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Center, Grid, Stack, styled } from 'styled-system/jsx';
import ProductItem from '../components/ProductItem';
import { productQueries } from '@/remotes/queries/product';
import { useSuspenseQueries } from '@tanstack/react-query';
import { ErrorBoundary } from '@suspensive/react';
import ErrorSection from '@/components/ErrorSection';
import type { Product } from '@/remotes/product';
import { useCurrency } from '@/providers/CurrencyProvider';
import { exchangeQueries } from '@/remotes/queries/exchange';
import { formatPrice } from '@/utils/price';
import { useShoppingCartActions, useShoppingCartState } from '@/providers/ShoppingCartProvider';
import { getAvailableStock } from '@/utils/stock';
import type { ExchangeRate } from '@/remotes/exchange';

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
      return product satisfies never;
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

// 제품이 없을 경우 컴포넌트
const EmptyProductListContainer = () => {
  return (
    <Center py={10}>
      <Text variant="B2_Regular" color="text.02_gray">
        표시할 상품이 없습니다
      </Text>
    </Center>
  );
};

// 제품 목록 컴포넌트
const ProductGrid = ({ products, exchangeRate }: { products: Product[]; exchangeRate: ExchangeRate }) => {
  const navigate = useNavigate();

  const { currency } = useCurrency();
  const { items: cartItems } = useShoppingCartState();
  const { addToShoppingCart, removeFromShoppingCart } = useShoppingCartActions();

  const handleClickProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product: Product) => {
    addToShoppingCart(product);
  };

  const handleRemoveFromCart = (product: Product) => {
    removeFromShoppingCart(product.id, 1);
  };

  return (
    <Grid gridTemplateColumns="repeat(2, 1fr)" rowGap={9} columnGap={4} p={5}>
      {products.map(product => {
        const availableStock = getAvailableStock(product, cartItems);

        return (
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
              <Counter.Minus
                onClick={() => {
                  handleRemoveFromCart(product);
                }}
                disabled={availableStock >= product.stock} // 원본 재고와 같으면 담은 게 없다는 뜻이므로
              />
              <Counter.Display value={availableStock} />
              <Counter.Plus onClick={() => handleAddToCart(product)} disabled={availableStock <= 0} />
            </Counter.Root>
          </ProductItem.Root>
        );
      })}
    </Grid>
  );
};

// 데이터 패칭 컨테이너
const ProductListContainer = () => {
  const [currentTab, setCurrentTab] = useState('all');

  const [{ data: productList }, { data: exchangeRate }] = useSuspenseQueries({
    queries: [productQueries.productList(), exchangeQueries.exchangeRate()],
  });

  const filteredProductList =
    currentTab === 'all' ? productList : productList.filter(p => p.category.toLowerCase() === currentTab);

  const renderProductList = () => {
    return filteredProductList.length === 0 ? (
      <EmptyProductListContainer />
    ) : (
      <ProductGrid products={filteredProductList} exchangeRate={exchangeRate} />
    );
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

      {renderProductList()}
    </styled.section>
  );
};

const ProductListSection = ErrorBoundary.with(
  {
    fallback: ({ reset }) => <ErrorSection onRetry={reset} />,
  },
  () => (
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductListContainer />
    </Suspense>
  )
);

export default ProductListSection;
