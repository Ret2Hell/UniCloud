"use client";

import BookmarksSkeleton from "@/components/root/BookmarksSkeleton";
import EmptyState from "@/components/root/EmptyState";
import FileCard from "@/components/root/FileCard";
import SearchInput from "@/components/root/SearchInput";
import { useGetBookmarkedFilesQuery } from "@/state/api";
import { useState, useMemo } from "react";

const BookmarksPage = () => {
  const { data: files = [] as FileItem[], isLoading } =
    useGetBookmarkedFilesQuery({});
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFiles: FileItem[] = useMemo(
    () =>
      files.filter((file: FileItem) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [files, searchQuery]
  );

  if (isLoading) {
    return <BookmarksSkeleton />;
  }

  const isEmptyState = !filteredFiles.length;

  return (
    <main className="mx-4 flex-1 p-6 w-full relative">
      <div className="space-y-4">
        {/* Search bar */}
        <div className="flex items-center justify-end flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
        {isEmptyState ? (
          <EmptyState message="No bookmarked files found" />
        ) : (
          <section aria-labelledby="bookmarked-files-section">
            <h3
              id="bookmarked-files-section"
              className="text-sm font-medium text-muted-foreground"
            >
              Bookmarked Files
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {filteredFiles.map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default BookmarksPage;
