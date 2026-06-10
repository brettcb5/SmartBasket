import { TrendingDown, Tag } from "lucide-react";
import { Pill } from "@/components/DesignSystem/Pill";

export const AlternativesTable = ({ alternatives }) => {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <section className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
      <div className="p-6 border-b border-[#E5E7EB] flex items-center gap-3">
        <div className="w-8 h-8 bg-[#ECFDF5] rounded-lg flex items-center justify-center">
          <TrendingDown className="w-4 h-4 text-[#059669]" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">AI Savings Suggestions</h3>
          <p className="text-sm text-[#6B7280]">
            Swap these items to cut your bill further.
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <th className="px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Current Item
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Cheaper Alternative
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Est. Savings
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Why
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {alternatives.map((alt, i) => (
              <tr
                key={i}
                className="hover:bg-[#F9FAFB] transition-colors group"
              >
                <td className="px-6 py-4 text-sm font-medium text-[#111827]">
                  {alt.original}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#059669]" />
                    <span className="text-sm text-[#374151] font-medium">
                      {alt.suggested}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Pill variant="green">Save {alt.savings}</Pill>
                </td>
                <td className="px-6 py-4 text-xs text-[#6B7280] max-w-xs">
                  {alt.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
