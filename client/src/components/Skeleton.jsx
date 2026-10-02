import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm animate-pulse space-y-4">
    <div className="w-full h-48 bg-gray-200 rounded-xl"></div>
    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
    <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full space-y-3 animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-12 bg-gray-200 rounded-xl w-full"></div>
    ))}
  </div>
);

export const DetailSkeleton = () => (
  <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
    <div className="h-96 bg-gray-200 rounded-2xl"></div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-24 bg-gray-200 rounded-xl"></div>
      <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
    </div>
  </div>
);
