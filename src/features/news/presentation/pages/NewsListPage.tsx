import { USER_ROLES } from '@/shared/constants/featuresFlags';
import { Session, useSession } from 'next-auth/react';
import { useNewsData } from '../../hooks/useNewsData';
import { useNewsUpsert } from '../../hooks/useNewsUpsert';
import { useGetNewsQuery } from '../../store/api/newsApi';
import CardList from '../organisms/CardList';
import NewsPageHeader from '../organisms/NewsPageHeader';

const NewsListPage = () => {
  // Hooks
  // const { data: categoriesWithPost = [] } = useGetFaqCategoriesWithPostQuery({
  //   type: PostType.NEWS,
  //   limit: FAQ_LIST_CONSTANTS.FAQS_PER_CATEGORY,
  // });

  const { data: newestNewsList = [], isLoading: loading } = useGetNewsQuery({
    page: 1,
    limit: 3,
    orderBy: 'createdAt',
    orderDirection: 'desc',
  });
  const {
    activeFilters,
    expandedCategories,
    // filteredNews,
    handleLoadMoreNews,
    allCategoriesList,
    hasActiveFilters,
    isLoading,
    isFetchingPage,
    allNews,
    endOfNews,
    // mostViewedNews,
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
        <div className="mx-auto max-w-5xl">
          <CardList
            newsList={allNews}
            isLoading={isLoading}
            isFetchingPage={isFetchingPage}
            handleLoadMoreNews={handleLoadMoreNews}
            endOfNews={endOfNews}
          />
        </div>
      </main>
    </div>

    //   {/* Main Content */}
    //   {hasActiveFilters ? (
    //     <FilteredCategoriesSection categoriesWithFaqs={filteredFaqs} isLoading={isLoading} />
    //   ) : (
    //     <>
    //       <h3 className="text-2xl font-bold text-center">FAQ Center</h3>
    //       <MostViewedSection faqs={mostViewedFaqs} isLoading={isLoading} />
    //       <CategoriesSection
    //         categoriesWithFaqs={categoriesWithPost || []}
    //         expandedCategories={expandedCategories}
    //         expandedCategoryFaqs={expandedCategoryFaqs}
    //         onShowMore={handleShowMore}
    //         isLoading={isLoading}
    //       />
    //     </>
    //   )}
  );
};

export default NewsListPage;
