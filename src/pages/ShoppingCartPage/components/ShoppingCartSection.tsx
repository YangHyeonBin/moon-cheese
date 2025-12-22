import { Button, Counter, Spacing, Text } from '@/ui-lib';
import { Divider, Flex, Stack, styled } from 'styled-system/jsx';
import ShoppingCartItem from './ShoppingCartItem';
import { useShoppingCartActions, useShoppingCartState } from '@/providers/ShoppingCartProvider';
import React from 'react';
import { formatPrice } from '@/utils/price';
import { useCurrency } from '@/providers/CurrencyProvider';
import { exchangeQueries } from '@/remotes/queries/exchange';
import { useQuery } from '@tanstack/react-query';
import type { Product } from '@/remotes/product';
import Tooltip from '@/ui-lib/components/tooltip';
import ConfirmModal from '@/ui-lib/components/confirm-modal';
import { toast } from '@/ui-lib/components/toast';
import { CATEGORY_TO_TAG_TYPE } from '@/constants/category';

// 쇼핑 카트 컴포넌트
const ShoppingCartSection = () => {
  const { cartItems } = useShoppingCartState();
  const { addToShoppingCart, removeFromShoppingCart, deleteFromShoppingCart, clearShoppingCart } =
    useShoppingCartActions();

  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Flex justify="space-between">
        <Text variant="H2_Bold">장바구니</Text>
        <ConfirmModal
          trigger={
            <Button color={'neutral'} size="sm">
              전체 삭제
            </Button>
          }
          title="장바구니 비우기"
          description="장바구니의 모든 상품을 삭제할까요?"
          onConfirm={() => {
            // cartItems.forEach(item => deleteFromShoppingCart(item.product.id));
            clearShoppingCart();
            toast.success('장바구니를 비웠습니다.');
          }}
        />
      </Flex>
      <Spacing size={4} />
      <Stack
        gap={5}
        css={{
          p: 5,
          border: '1px solid',
          borderColor: 'border.01_gray',
          rounded: '2xl',
        }}
      >
        {cartItems.map((item, index) => {
          return (
            <React.Fragment key={item.product.id}>
              <ShoppingCartItem.Root>
                {item.product.images.length > 0 && (
                  <ShoppingCartItem.Image src={item.product.images[0]} alt={item.product.name} />
                )}
                <ShoppingCartItem.Content>
                  <ShoppingCartItem.Info
                    type={CATEGORY_TO_TAG_TYPE[item.product.category]}
                    title={item.product.name}
                    description={item.product.description}
                    onDelete={() => {
                      deleteFromShoppingCart(item.product.id);
                      toast.success(`${item.product.name}(이)가 삭제되었습니다.`);
                    }}
                  />
                  <ShoppingCartItem.Footer>
                    <ShoppingCartItemPrice product={item.product} />
                    <Counter.Root>
                      <Counter.Minus
                        onClick={() => {
                          removeFromShoppingCart(item.product.id);
                        }}
                        disabled={item.quantity <= 0}
                      />
                      <Counter.Display value={item.quantity} />
                      <Counter.Plus
                        onClick={() => {
                          addToShoppingCart(item.product);
                        }}
                        disabled={item.product.stock <= item.quantity}
                      />
                    </Counter.Root>
                  </ShoppingCartItem.Footer>
                </ShoppingCartItem.Content>
              </ShoppingCartItem.Root>

              {index !== cartItems.length - 1 && <Divider color="border.01_gray" />}
            </React.Fragment>
          );
        })}
      </Stack>
    </styled.section>
  );
};

// 가격 표시 컴포넌트 (환율 정보 패치)
const ShoppingCartItemPrice = ({ product }: { product: Product }) => {
  const { currency } = useCurrency();
  const { data: exchangeRate, isLoading, isError } = useQuery(exchangeQueries.exchangeRate());

  if (isLoading) {
    return <PriceSkeleton />;
  }
  if (isError) {
    return (
      <Flex align="center" gap={2}>
        <Tooltip label="환율 정보를 불러올 수 없어 USD로 표시됩니다" />
        <ShoppingCartItem.Price>{formatPrice(product.price, currency, exchangeRate)}</ShoppingCartItem.Price>
      </Flex>
    );
  }

  return <ShoppingCartItem.Price>{formatPrice(product.price, currency, exchangeRate)}</ShoppingCartItem.Price>;
};

// 가격 표시 컴포넌트 스켈레톤
const PriceSkeleton = () => {
  return (
    <styled.div
      css={{
        w: '80px',
        h: '20px',
        rounded: 'md',
        bg: 'background.02_light-gray',
        animation: 'skeleton-pulse',
      }}
    />
  );
};

export default ShoppingCartSection;
