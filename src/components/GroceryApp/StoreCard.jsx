import { CheckCircle2, Star, Globe, ExternalLink } from "lucide-react";
import { Card } from "@/components/DesignSystem/Card";
import { CircularProgress } from "@/components/DesignSystem/CircularProgress";
import { Pill } from "@/components/DesignSystem/Pill";

export const StoreCard = ({ store, idx }) => {
  return (
    <Card
      className={`relative ${idx === 0 ? "border-[#059669] ring-1 ring-[#059669]" : ""}`}
    >
      {idx === 0 && (
        <div className="absolute -top-3 left-4">
          <span className="bg-[#059669] text-white text-xs font-bold px-3 py-1 rounded-full">
            Best Value
          </span>
        </div>
      )}

      <div className="flex justify-between items-start mb-4 mt-1">
        <div className="flex-1 min-w-0 mr-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-base leading-tight">{store.name}</h4>
            {idx === 0 && (
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
            )}
          </div>
          <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed truncate">
            {store.address}
          </p>
          {store.rating && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
              <span className="text-xs text-[#6B7280]">
                {store.rating} on Google
              </span>
            </div>
          )}
        </div>
        <CircularProgress value={store.affordability_score} />
      </div>

      <div className="space-y-2 mb-4 border-t border-[#F3F4F6] pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#6B7280]">Total estimate</span>
          <span className="text-xl font-bold">${store.total}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#9CA3AF]">Items priced</span>
          <span className="text-xs font-medium text-[#374151]">
            {store.itemsFound} / {store.itemsRequested}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#9CA3AF]">Store tier</span>
          <Pill
            variant={
              store.affordability_tier === "budget"
                ? "green"
                : store.affordability_tier === "premium"
                  ? "amber"
                  : "outline"
            }
          >
            {store.affordability_tier}
          </Pill>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#9CA3AF]">Live data</span>
          <Pill variant={store.scraped ? "soft" : "outline"}>
            {store.scraped ? "✓ Scraped" : "AI Estimated"}
          </Pill>
        </div>
      </div>

      {store.store_note && (
        <p className="text-xs text-[#6B7280] italic mb-4 border-t border-[#F3F4F6] pt-3">
          {store.store_note}
        </p>
      )}

      {store.website && (
        <a
          href={store.website}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 text-xs font-semibold border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors flex items-center justify-center gap-1.5 text-[#374151]"
        >
          <Globe className="w-3.5 h-3.5" /> Visit Store Website
          <ExternalLink className="w-3 h-3 text-[#9CA3AF]" />
        </a>
      )}
    </Card>
  );
};
