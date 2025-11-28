import BannerSection from './components/BannerSection';
import CurrentLevelSection from './components/CurrentLevelSection';
import ProductListSection from './components/ProductListSection';
import RecentPurchaseSection from './components/RecentPurchaseSection';

function HomePage() {
  // const { data, isLoading, error } = useExchangeRate();
  // const { data: me } = useMe();
  // const { data: grade } = useGradePoint();
  // const { data: recent } = useRecentProductList();

  // if (isLoading) {
  //   return <Loader />;
  // }

  // if (error) {
  //   console.warn(`환율 패칭 중 에러 발생, ${error}`);
  //   return <ErrorSection />;
  // }

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
