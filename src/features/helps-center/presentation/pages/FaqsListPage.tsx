import { FAQ_LIST_CONSTANTS } from '@/features/helps-center/constants';
import { useFaqsData } from '@/features/helps-center/hooks/useFaqsData';
import { USER_ROLES } from '@/shared/constants/featuresFlags';
import { Session, useSession } from 'next-auth/react';
import { PostType } from '../../domain/entities/models/faqs';
import { useGetFaqCategoriesWithPostQuery } from '../../store/api/helpsCenterApi';
import CategoriesSection from '../organisms/CategoriesSection';
import FaqsPageHeader from '../organisms/FaqsPageHeader';
import FilteredCategoriesSection from '../organisms/FilteredCategoriesSection';
import MostViewedSection from '../organisms/MostViewedSection';

const FaqsListPage = () => {
  // Hooks
  const { data: categoriesWithPost = [] } = useGetFaqCategoriesWithPostQuery({
    type: PostType.FAQ,
    limit: FAQ_LIST_CONSTANTS.FAQS_PER_CATEGORY,
  });
  const {
    activeFilters,
    expandedCategories,
    mostViewedFaqs,
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
    <div className="w-full px-6 space-y-8 mb-6">
      {/* Page Header with Filters */}
      <FaqsPageHeader
        categories={categoriesWithPost}
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
            categoriesWithFaqs={categoriesWithPost || []}
            expandedCategories={expandedCategories}
            expandedCategoryFaqs={expandedCategoryFaqs}
            onShowMore={handleShowMore}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
};

export default FaqsListPage;
