const Searchbar = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories }) => {
  return (
    <div className="flex space-x-4">
      <input
        type="text"
        placeholder="Search manufacturers"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 rounded-md"
      />

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="p-2 rounded-md"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Searchbar;
