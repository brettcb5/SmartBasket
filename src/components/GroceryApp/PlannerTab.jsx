import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { QuickSearchChips } from "./QuickSearchChips";
import { InfoBanner } from "./InfoBanner";
import { GroceryList } from "./GroceryList";

export const PlannerTab = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  searchMutation,
  searchError,
  addItem,
  addCustomItem,
  searchRef,
  list,
  updateQty,
  removeItem,
  compareError,
  compareMutation,
  handleCompare,
  location,
}) => {
  return (
    <motion.div
      key="planner"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-8"
    >
      {/* Left: Search & Results */}
      <div className="md:col-span-7 space-y-6">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          searchMutation={searchMutation}
          searchError={searchError}
          addItem={addItem}
          addCustomItem={addCustomItem}
          searchRef={searchRef}
        />
        <QuickSearchChips setSearchQuery={setSearchQuery} />

        {/* Location tip banner */}
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4 flex gap-3">
          <MapPin className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#065F46]">Location tip</p>
            <p className="text-xs text-[#059669] mt-1">
              Enter a <strong>city &amp; state</strong> (e.g. "Macungie, PA"){" "}
              <em>or</em> a <strong>ZIP code</strong> (e.g. 18062) in the
              location bar above. For small towns, trying the nearest larger
              city usually finds more stores.
            </p>
          </div>
        </div>

        <InfoBanner />
      </div>

      {/* Right: Grocery List */}
      <div className="md:col-span-5">
        <GroceryList
          list={list}
          updateQty={updateQty}
          removeItem={removeItem}
          compareError={compareError}
          compareMutation={compareMutation}
          handleCompare={handleCompare}
          location={location}
        />
      </div>
    </motion.div>
  );
};
