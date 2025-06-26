interface CategoryChipsProps {
  categories: string[];
}

const CategoryChips = ({ categories }: CategoryChipsProps) => {
  if (categories.length <= 1) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map((category) => (
        <span key={category} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {category}
        </span>
      ))}
    </div>
  );
};

export default CategoryChips;
