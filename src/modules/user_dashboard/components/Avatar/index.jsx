export function Avatar({ children, className = "" }) {
  return (
    <div
      className={`w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}
    >
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt = "" }) {
  return <img src={src} alt={alt} className="w-full h-full object-cover" />;
}

export function AvatarFallback({ children }) {
  return <span className="text-gray-600 font-medium">{children}</span>;
}
