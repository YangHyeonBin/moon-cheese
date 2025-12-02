import { EnhancedToastProvider } from '@/ui-lib/components/toast';
import { CurrencyProvider } from './CurrencyProvider';
import { QueryProvider } from './QueryProvider';

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <CurrencyProvider>
        <EnhancedToastProvider>{children}</EnhancedToastProvider>
      </CurrencyProvider>
    </QueryProvider>
  );
};

export default GlobalProvider;
