import { Info } from "lucide-react";

export const InfoBanner = () => {
  return (
    <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 flex gap-3">
      <Info className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-[#1D4ED8]">How it works</p>
        <p className="text-xs text-[#3B82F6] mt-1">
          SmartBasket finds grocery stores near your zip code, scrapes live
          pricing data from their websites, and uses AI to compare the total
          cost of your list — then suggests cheaper alternatives.
        </p>
      </div>
    </div>
  );
};
