import { ErrorBoundary } from '@suspensive/react';
import { Suspense, type ReactNode } from 'react';

/**
 * 비동기 데이터 패칭 컴포넌트의 로딩/에러 상태를 선언적으로 처리하는 래퍼
 * ErrorBoundary + Suspense로 구성
 */
const AsyncBoundary = ({
  children,
  errorFallback,
  suspenseFallback,
}: {
  children: ReactNode;
  errorFallback: ({ onRetry }: { onRetry: () => void }) => ReactNode;
  suspenseFallback: ReactNode;
}) => {
  return (
    <ErrorBoundary fallback={({ reset }) => errorFallback({ onRetry: reset })}>
      <Suspense fallback={suspenseFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default AsyncBoundary;
