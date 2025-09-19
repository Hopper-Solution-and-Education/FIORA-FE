import { PostCategoryResponse } from '../../api/types/postCategoryDTO';
import { NewsFilterValues } from './NewsPageHeader';

interface NewsPageHeaderProps {
  activeFilters: NewsFilterValues;
  categories: PostCategoryResponse[];
  onFilterChange: (filters: NewsFilterValues) => void;
}

const Categories = ({ categories, onFilterChange, activeFilters }: NewsPageHeaderProps) => {
  return (
    <div className="w-full rounded-xl bg-background p-5 shadow-sm">
      <h3 className="text-lg font-bold text-foreground mb-4 pb-3 border-b border-slate-200">
        Chuyên mục
      </h3>
      <div className="flex flex-col gap-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onFilterChange({ categories: [category.id], search: '' })}
            className={`block rounded-md px-3 py-2 text-sm text-foreground font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 ${activeFilters.categories.includes(category.id) ? 'bg-sidebar-border' : ''}`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
