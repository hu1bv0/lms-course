import React from 'react';

function SimpleLoading() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600 text-sm">Đang tải...</p>
    </div>
  );
}

export default SimpleLoading;
