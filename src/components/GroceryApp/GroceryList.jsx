import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/DesignSystem/Card";
import { Pill } from "@/components/DesignSystem/Pill";

export const GroceryList = ({
  list,
  updateQty,
  removeItem,
  compareError,
  compareMutation,
  handleCompare,
  location,
}) => {
  return (
    <Card className="sticky top-28">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">My Grocery List</h3>
        <Pill variant="soft">{list.length} Items</Pill>
      </div>

      <div className="space-y-3 mb-6 max-h-[380px] overflow-y-auto pr-1">
        {list.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-[#E5E7EB] rounded-xl">
            <ShoppingCart className="w-10 h-10 text-[#E5E7EB] mx-auto mb-3" />
            <p className="text-sm text-[#9CA3AF]">Search for items to add</p>
            <p className="text-xs text-[#D1D5DB] mt-1">
              or click a quick search chip
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {list.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center justify-between py-2.5 border-b border-[#F3F4F6] last:border-0"
              >
                <div className="flex-1 min-w-0 mr-2">
                  <p className="text-sm font-semibold truncate">{item.name}</p>
                  <p className="text-xs text-[#9CA3AF]">
                    {item.unit} · {item.category}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-[#F9FAFB] rounded-lg p-1">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="p-1 hover:bg-white rounded-md transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="p-1 hover:bg-white rounded-md transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#D1D5DB] hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {compareError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600 font-medium">{compareError}</p>
          <p className="text-xs text-red-400 mt-1">
            Try entering a nearby city name (e.g. "Allentown, PA") instead of a
            ZIP code.
          </p>
        </div>
      )}

      <button
        disabled={list.length === 0 || compareMutation.isPending}
        onClick={handleCompare}
        className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
      >
        {compareMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Finding stores & comparing prices…
          </>
        ) : (
          <>
            Compare Stores Near {location || "your location"}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {compareMutation.isPending && (
        <div className="mt-3 space-y-1.5">
          {[
            "Locating grocery stores via Google Maps…",
            "Scraping live pricing data…",
            "Running AI price analysis…",
          ].map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs text-[#6B7280]"
            >
              <div
                className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
              {step}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
