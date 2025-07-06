import React from 'react';
import './CategoryFilter.css';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  onClearAll?: () => void;
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
  onClearAll,
  className = '',
}) => {
  const handleCategoryClick = (category: string) => {
    if (selectedCategories.includes(category)) {
      // Remove category
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      // Add category
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleClearAll = () => {
    onCategoryChange([]);
    onClearAll?.();
  };

  return (
    <div className={`category-filter ${className}`}>
      <button
        className={`filter-btn ${
          selectedCategories.length === 0 ? 'active' : ''
        }`}
        onClick={handleClearAll}
      >
        전체
      </button>
      {categories.map(category => (
        <button
          key={category}
          className={`filter-btn ${
            selectedCategories.includes(category) ? 'active' : ''
          }`}
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
