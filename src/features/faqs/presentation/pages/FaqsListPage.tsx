import { useFaqsData } from '@/features/faqs/hooks/useFaqsData';
import { USER_ROLES } from '@/shared/constants/featuresFlags';
import { Session, useSession } from 'next-auth/react';
import { FAQ_LIST_CONSTANTS } from '../../constants';
import { useGetFaqCategoriesQuery } from '../../store/api/faqsApi';
import CategoriesSection from '../organisms/CategoriesSection';
import FaqsPageHeader from '../organisms/FaqsPageHeader';
import FilteredCategoriesSection from '../organisms/FilteredCategoriesSection';
import MostViewedSection from '../organisms/MostViewedSection';

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

  const isAdminOrCS =
    session?.user?.role?.toUpperCase() === USER_ROLES.ADMIN ||
    session?.user?.role?.toUpperCase() === USER_ROLES.CS;

  return (
    <div className="w-full px-4 space-y-8 mb-6">
      {/* Page Header with Filters */}
      <FaqsPageHeader
        categories={categories}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
        isAdminOrCS={isAdminOrCS}
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
