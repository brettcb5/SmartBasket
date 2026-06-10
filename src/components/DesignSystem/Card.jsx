export const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl border border-[#E5E7EB] p-6 ${className}`}
  >
    {children}
  </div>
);
