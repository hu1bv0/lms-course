import { useSelector } from "react-redux";

export default function LoadingOverlay() {
  const isLoading = useSelector((state) => state.loading.count > 0);

  if (!isLoading) return null;

  return (
    <div className="fixed z-[9999] bg-black bg-opacity-40 flex items-center justify-center w-[80%] h-full">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#A10101]"></div>
    </div>
  );
}
