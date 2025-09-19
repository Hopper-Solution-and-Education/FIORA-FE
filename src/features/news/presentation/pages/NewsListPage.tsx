import { USER_ROLES } from '@/shared/constants/featuresFlags';
import { Session, useSession } from 'next-auth/react';
import { useNewsData } from '../../hooks/useNewsData';
import { useNewsUpsert } from '../../hooks/useNewsUpsert';
import CardList from '../organisms/CardList';
import Categories from '../organisms/Categories';
import NewsPageHeader from '../organisms/NewsPageHeader';

const NewsListPage = () => {
  const {
    activeFilters,
    handleLoadMoreNews,
    allCategoriesList,
    isLoading,
    isFetchingPage,
    allNews,
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
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            {/* Cột bên trái: Danh sách bài viết (chiếm 2/3 không gian) */}
            <div className="lg:col-span-4">
              <CardList
                newsList={allNews}
                isLoading={isLoading}
                isFetchingPage={isFetchingPage}
                handleLoadMoreNews={handleLoadMoreNews}
                endOfNews={endOfNews}
              />
            </div>

            {/* Cột bên phải: Sidebar (chiếm 1/3 không gian) */}
            <div className="lg:col-span-1">
              {/*
              'sticky' và 'top-8' giúp sidebar "dính" lại ở phía trên màn hình
              khi người dùng cuộn trang, một trải nghiệm rất phổ biến và tiện lợi.
            */}
              <aside className="sticky top-8">
                <Categories
                  activeFilters={activeFilters}
                  categories={allCategoriesList}
                  onFilterChange={handleFilterChange}
                />
              </aside>
            </div>
          </div>
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
