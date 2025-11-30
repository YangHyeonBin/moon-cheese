import { EnhancedToastProvider } from '@/ui-lib/components/toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CurrencyProvider } from './CurrencyProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <EnhancedToastProvider>{children}</EnhancedToastProvider>
      </CurrencyProvider>
    </QueryClientProvider>
  );
};

export default GlobalProvider;
