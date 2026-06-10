import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { ComparisonSummary } from "./ComparisonSummary";
import { StoreCard } from "./StoreCard";
import { PriceBreakdownTable } from "./PriceBreakdownTable";
import { AlternativesTable } from "./AlternativesTable";

export const ComparisonTab = ({ comparisonResult, list, setActiveTab }) => {
  return (
    <motion.div
      key="comparison"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <ComparisonSummary comparisonResult={comparisonResult} list={list} />

      {/* Store Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {comparisonResult.allStores.map((store, idx) => (
          <StoreCard key={store.id} store={store} idx={idx} />
        ))}
      </div>

      <PriceBreakdownTable bestOption={comparisonResult.bestOption} />

      <AlternativesTable
        alternatives={comparisonResult.bestOption.alternatives}
      />

      {/* Re-run button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => setActiveTab("planner")}
          className="flex items-center gap-2 px-6 py-3 border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#374151] hover:bg-white hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
        >
          <ShoppingCart className="w-4 h-4" /> Edit List & Re-compare
        </button>
      </div>
    </motion.div>
  );
};
