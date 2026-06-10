export const Pill = ({ children, variant = "outline", dotColor }) => {
  const base =
    "px-3 py-1 text-xs font-medium inline-flex items-center gap-1.5 rounded-full";
  const variants = {
    outline: "bg-white border border-[#E5E7EB] text-[#6B7280]",
    soft: "bg-[#EFF6FF] text-[#2563EB]",
    green: "bg-[#ECFDF5] text-[#059669]",
    amber: "bg-[#FFFBEB] text-[#D97706]",
    status: "bg-white border border-[#E5E7EB] text-[#111827]",
  };
  return (
    <span className={`${base} ${variants[variant]}`}>
      {variant === "status" && dotColor && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      )}
      {children}
    </span>
  );
};
