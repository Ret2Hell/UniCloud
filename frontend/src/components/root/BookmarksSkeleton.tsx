"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const BookmarksSkeleton = () => {
  return (
    <main className=" flex-1 p-6 w-full relative">
      <div className="space-y-4">
        {/* Search Bar Skeleton */}
        <div className="flex items-center justify-end flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Skeleton className="h-9 w-48" />
          </div>
        </div>

        {/* Section Title Skeleton */}
        <Skeleton className="h-5 w-40" />

        {/* Bookmarked Files Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    </main>
  );
};

export default BookmarksSkeleton;
