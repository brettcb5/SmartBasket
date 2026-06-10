import { ShoppingCart, MapPin } from "lucide-react";
import { motion } from "motion/react";

export const Header = ({
  location,
  setLocation,
  radius,
  setRadius,
  activeTab,
  setActiveTab,
  comparisonResult,
}) => {
  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
            <ShoppingCart className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">SmartBasket</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-3 py-1.5 h-9">
            <MapPin className="w-4 h-4 text-[#6B7280] shrink-0" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="text-sm font-medium focus:outline-none w-40"
              placeholder="City, State or ZIP"
            />
            <span className="text-[#E5E7EB]">|</span>
            <select
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="text-sm font-medium focus:outline-none bg-transparent"
            >
              <option value={5}>5 mi</option>
              <option value={10}>10 mi</option>
              <option value={20}>20 mi</option>
              <option value={30}>30 mi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex gap-8">
        {[
          { id: "planner", label: "List Planner" },
          {
            id: "comparison",
            label: "Price Comparison",
            disabled: !comparisonResult,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={`pb-3 text-sm transition-all relative ${
              activeTab === tab.id
                ? "text-[#111827] font-semibold"
                : "text-[#6B7280] font-normal hover:text-[#4B5563]"
            } ${tab.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563EB] -mb-[1px]"
              />
            )}
          </button>
        ))}
      </div>
    </header>
  );
};
