import { USER_ROLES } from '@/shared/constants/featuresFlags';
import { Session, useSession } from 'next-auth/react';
import { useNewsData } from '../../hooks/useNewsData';
import { useNewsUpsert } from '../../hooks/useNewsUpsert';
import CardList from '../organisms/CardList';
import MostViewedNews from '../organisms/MostViewNews';
import NewsPageHeader from '../organisms/NewsPageHeader';

const NewsListPage = () => {
  const {
    activeFilters,
    handleLoadMoreNews,
    allCategoriesList,
    isLoading,
    isFetchingPage,
    allNews,
    mostViewNewsList,
    endOfNews,
    handleFilterChange,
  } = useNewsData();
  const { categories } = useNewsUpsert();

  const { data: session } = useSession() as { data: Session | null };

  const isAdmin = session?.user?.role?.toUpperCase() === USER_ROLES.ADMIN;
  return (
    <div className="w-full px-6 space-y-8 mb-6">
      <NewsPageHeader
        categories={categories}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
        isAdmin={isAdmin}
      />
      <main className="min-h-screen bg-secondary px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="w-full lg:w-3/4 flex-grow">
              <CardList
                newsList={allNews}
                isLoading={isLoading}
                isFetchingPage={isFetchingPage}
                handleLoadMoreNews={handleLoadMoreNews}
                endOfNews={endOfNews}
              />
            </div>

            <div className="w-full lg:w-1/4 order-first lg:order-last">
              <aside className="sticky top-8">
                <MostViewedNews news={mostViewNewsList} />
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewsListPage;
