const QUICK_SEARCH_ITEMS = [
  "milk",
  "eggs",
  "bread",
  "chicken",
  "apples",
  "pasta",
  "butter",
  "orange juice",
  "yogurt",
  "cheese",
  "rice",
  "bananas",
];

export const QuickSearchChips = ({ setSearchQuery }) => {
  return (
    <div>
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
        Quick Search
      </p>
      <div className="flex flex-wrap gap-2">
        {QUICK_SEARCH_ITEMS.map((q) => (
          <button
            key={q}
            onClick={() => setSearchQuery(q)}
            className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-full text-sm text-[#374151] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors capitalize"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};
