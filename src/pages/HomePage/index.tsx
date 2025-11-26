import { useExchangeRate } from '@/hooks/queries/exchange';
import BannerSection from './components/BannerSection';
import CurrentLevelSection from './components/CurrentLevelSection';
import ProductListSection from './components/ProductListSection';
import RecentPurchaseSection from './components/RecentPurchaseSection';
import { Loader } from 'lucide-react';
import ErrorSection from '@/components/ErrorSection';

function HomePage() {
  const { data, isLoading, error } = useExchangeRate();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    console.warn(`환율 패칭 중 에러 발생, ${error}`);
    return <ErrorSection />;
  }

  console.log(data);

  return (
    <>
      <BannerSection />
      <CurrentLevelSection />
      <RecentPurchaseSection />
      <ProductListSection />
    </>
  );
}

export default HomePage;
