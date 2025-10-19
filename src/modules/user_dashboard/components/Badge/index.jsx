export function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-block text-sm font-medium rounded-full px-2 py-1 bg-gray-100 text-gray-800 ${className}`}
    >
      {children}
    </span>
  );
}
