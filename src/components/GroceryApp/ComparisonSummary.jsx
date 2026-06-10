import { MapPin } from "lucide-react";
import { Pill } from "@/components/DesignSystem/Pill";

export const ComparisonSummary = ({ comparisonResult, list }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-[#E5E7EB] pb-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight mb-2">
          Market Analysis
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Pill variant="outline">
            <MapPin className="w-3 h-3" /> {comparisonResult.location}
          </Pill>
          <Pill variant="outline">{comparisonResult.radius} mile radius</Pill>
          <Pill variant="soft">
            {comparisonResult.storesFound} stores found
          </Pill>
          <Pill variant="outline">{list.length} items</Pill>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="text-right">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
            Best Price
          </p>
          <p className="text-3xl font-bold text-[#059669]">
            ${comparisonResult.bestOption.total}
          </p>
          <p className="text-xs text-[#6B7280]">
            @ {comparisonResult.bestOption.name}
          </p>
        </div>
        <div className="w-px bg-[#E5E7EB]" />
        <div className="text-right">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
            Most Expensive
          </p>
          <p className="text-3xl font-bold text-[#EA580C]">
            $
            {
              comparisonResult.allStores[comparisonResult.allStores.length - 1]
                .total
            }
          </p>
          <p className="text-xs text-[#6B7280]">
            @{" "}
            {
              comparisonResult.allStores[comparisonResult.allStores.length - 1]
                .name
            }
          </p>
        </div>
      </div>
    </div>
  );
};
