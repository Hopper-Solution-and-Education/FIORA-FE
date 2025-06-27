import { useFaqsData } from '@/features/faqs/hooks/useFaqsData';
import FaqsPageHeader from '../organisms/FaqsPageHeader';
import CategoriesSection from '../organisms/CategoriesSection';
import MostViewedSection from '../organisms/MostViewedSection';
import FilteredCategoriesSection from '../organisms/FilteredCategoriesSection';
import { FAQ_LIST_CONSTANTS } from '../../constants';
import { useGetFaqCategoriesQuery } from '../../store/api/faqsApi';
import { Session, useSession } from 'next-auth/react';

enum UserRole {
  USER = 'User',
  ADMIN = 'Admin',
  CS = 'CS',
}

const FaqsListPage = () => {
  // Hooks
  const { data: categories = [] } = useGetFaqCategoriesQuery();
  const {
    activeFilters,
    expandedCategories,
    mostViewedFaqs,
    categoriesWithFaqs,
    expandedCategoryFaqs,
    filteredFaqs,
    isLoading,
    hasActiveFilters,
    handleFilterChange,
    handleShowMore,
  } = useFaqsData();

  const { data: session } = useSession() as { data: Session | null };

  const isAdminOrCs = session?.user?.role === UserRole.ADMIN || session?.user?.role === UserRole.CS;

  return (
    <div className="w-full px-4 space-y-8 mb-6">
      {/* Page Header with Filters */}
      <FaqsPageHeader
        categories={categories}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
        isAdminOrCs={isAdminOrCs}
      />

      {/* Main Content */}
      {hasActiveFilters ? (
        <FilteredCategoriesSection categoriesWithFaqs={filteredFaqs} isLoading={isLoading} />
      ) : (
        <>
          <MostViewedSection faqs={mostViewedFaqs} isLoading={isLoading} />

          <h3 className="text-2xl font-bold text-center">FAQ Center</h3>

          <CategoriesSection
            categoriesWithFaqs={categoriesWithFaqs}
            expandedCategories={expandedCategories}
            expandedCategoryFaqs={expandedCategoryFaqs}
            onShowMore={handleShowMore}
            isLoading={isLoading}
            faqsPerCategory={FAQ_LIST_CONSTANTS.FAQS_PER_CATEGORY}
          />
        </>
      )}
    </div>
  );
};

export default FaqsListPage;
