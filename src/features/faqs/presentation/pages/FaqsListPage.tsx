import { useFaqCategories } from '@/features/faqs/hooks';
import { useFaqsData } from '@/features/faqs/hooks/useFaqsData';
import FaqsPageHeader from '../molecules/FaqsPageHeader';
import FaqsFilterResults from '../molecules/FaqsFilterResults';
import MostViewedSection from '../molecules/MostViewedSection';
import CategoriesSection from '../molecules/CategoriesSection';

const FaqsListPage = () => {
  // Hooks
  const { categories } = useFaqCategories();
  const {
    activeFilters,
    expandedCategories,
    mostViewedFaqs,
    categoriesWithFaqs,
    expandedCategoryFaqs,
    filterResults,
    isLoading,
    hasActiveFilters,
    handleFilterSubmit,
    handleShowMore,
    getFilterDisplayText,
    FAQS_PER_CATEGORY,
  } = useFaqsData();

  return (
    <div className="w-full px-4 space-y-8">
      {/* Page Header with Filters */}
      <FaqsPageHeader
        categories={categories}
        activeFilters={activeFilters}
        onFilterSubmit={handleFilterSubmit}
        isLoading={isLoading}
      />

      {/* Main Content */}
      {hasActiveFilters ? (
        <FaqsFilterResults
          faqs={filterResults}
          isLoading={isLoading}
          selectedCategories={activeFilters.categories}
          displayText={getFilterDisplayText()}
        />
      ) : (
        <>
          <MostViewedSection faqs={mostViewedFaqs} isLoading={isLoading} />
          <CategoriesSection
            categoriesWithFaqs={categoriesWithFaqs}
            expandedCategories={expandedCategories}
            expandedCategoryFaqs={expandedCategoryFaqs}
            onShowMore={handleShowMore}
            isLoading={isLoading}
            faqsPerCategory={FAQS_PER_CATEGORY}
          />
        </>
      )}
    </div>
  );
};

export default FaqsListPage;
