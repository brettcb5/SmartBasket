import { Search, X, Plus, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Pill } from "@/components/DesignSystem/Pill";

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  searchMutation,
  searchError,
  addItem,
  addCustomItem,
  searchRef,
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Search for Items</h2>
      <p className="text-sm text-[#6B7280] mb-4">
        Search any grocery item — AI will find options and alternatives.
      </p>

      <div className="relative" ref={searchRef}>
        <div className="relative flex items-center bg-white border-2 border-[#E5E7EB] focus-within:border-[#2563EB] rounded-xl transition-colors">
          <Search className="absolute left-4 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                if (searchResults.length > 0) addItem(searchResults[0]);
                else addCustomItem();
              }
            }}
            placeholder='Try "organic milk", "chicken breast", "cereal"…'
            className="w-full py-3.5 pl-12 pr-12 text-sm focus:outline-none rounded-xl bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="absolute right-4 text-[#9CA3AF] hover:text-[#6B7280]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        <AnimatePresence>
          {(searchMutation.isPending ||
            searchResults.length > 0 ||
            (searchQuery.trim().length >= 2 && !searchMutation.isPending)) && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-30 overflow-hidden"
            >
              {searchMutation.isPending && (
                <div className="flex items-center gap-3 px-4 py-4 text-sm text-[#6B7280]">
                  <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
                  <span>Finding items with AI…</span>
                </div>
              )}

              {!searchMutation.isPending && searchResults.length > 0 && (
                <>
                  <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">
                      AI Suggestions
                    </span>
                  </div>
                  <div className="divide-y divide-[#F3F4F6]">
                    {searchResults.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => addItem(item)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F9FAFB] transition-colors text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-[#111827]">
                              {item.name}
                            </span>
                            <Pill variant="outline">{item.brand}</Pill>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-[#6B7280]">
                              {item.category} · {item.unit}
                            </span>
                            <span className="text-xs font-medium text-[#059669]">
                              ~${item.typical_price?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <Plus className="w-5 h-5 text-[#2563EB] shrink-0 ml-3" />
                      </button>
                    ))}
                  </div>
                  {/* Add custom item option */}
                  <button
                    onClick={addCustomItem}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-[#F9FAFB] border-t border-[#E5E7EB] hover:bg-[#EFF6FF] transition-colors text-left"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#9CA3AF] flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5 text-[#6B7280]" />
                    </div>
                    <span className="text-sm text-[#6B7280]">
                      Add{" "}
                      <span className="font-semibold text-[#111827]">
                        "{searchQuery}"
                      </span>{" "}
                      as custom item
                    </span>
                  </button>
                </>
              )}

              {!searchMutation.isPending &&
                searchResults.length === 0 &&
                searchQuery.trim().length >= 2 &&
                !searchError && (
                  <div className="px-4 py-4">
                    <p className="text-sm text-[#6B7280] mb-2">
                      No suggestions found.
                    </p>
                    <button
                      onClick={addCustomItem}
                      className="flex items-center gap-2 text-sm font-medium text-[#2563EB] hover:underline"
                    >
                      <Plus className="w-4 h-4" /> Add "{searchQuery}" manually
                    </button>
                  </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {searchError && (
        <p className="text-xs text-red-500 mt-2">{searchError}</p>
      )}
    </div>
  );
};
