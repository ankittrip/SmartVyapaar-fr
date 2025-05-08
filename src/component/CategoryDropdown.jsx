import React from 'react';

const CategoryDropdown = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    '',
    'Textiles',
    'Electronics',
    'Furniture',
    'Automotive',
    'Food',
    'Pharmaceuticals',
  ];

  return (
    <select
      className="px-4 py-2 rounded-md text-black w-full md:w-60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      <option value="">All Categories</option>
      {categories.slice(1).map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
};

export default CategoryDropdown;
