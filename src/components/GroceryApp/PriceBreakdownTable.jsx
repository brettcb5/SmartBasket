import { Pill } from "@/components/DesignSystem/Pill";

export const PriceBreakdownTable = ({ bestOption }) => {
  return (
    <section className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
      <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-semibold text-lg">
            Price Breakdown — Best Store
          </h3>
          <p className="text-sm text-[#6B7280]">{bestOption.name}</p>
        </div>
        <Pill variant="soft">${bestOption.total} total</Pill>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <th className="px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Unit Price
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Qty
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Subtotal
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Source
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {bestOption.breakdown.map((row, i) => (
              <tr key={i} className="hover:bg-[#F9FAFB] transition-colors">
                <td className="px-6 py-3 text-sm font-medium text-[#111827]">
                  {row.item_name}
                  <span className="text-xs text-[#9CA3AF] ml-1">
                    / {row.unit}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-[#374151]">
                  ${row.price?.toFixed(2)}
                </td>
                <td className="px-6 py-3 text-sm text-[#374151]">
                  {row.quantity}
                </td>
                <td className="px-6 py-3 text-sm font-semibold text-[#111827]">
                  ${row.line_total}
                </td>
                <td className="px-6 py-3">
                  <Pill variant={row.scraped ? "soft" : "outline"}>
                    {row.scraped ? "Live" : "Estimated"}
                  </Pill>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#F9FAFB] border-t-2 border-[#E5E7EB]">
              <td
                colSpan={3}
                className="px-6 py-3 text-sm font-bold text-[#111827]"
              >
                Total
              </td>
              <td className="px-6 py-3 text-sm font-bold text-[#059669]">
                ${bestOption.total}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};
