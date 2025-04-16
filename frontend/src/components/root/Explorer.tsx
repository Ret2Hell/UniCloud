"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import FileActions from "./FileActions";
import ExplorerHeader from "./ExplorerHeader";
import SearchInput from "./SearchInput";
import EmptyState from "./EmptyState";
import FolderCard from "./FolderCard";
import FileCard from "./FileCard";

export default function Explorer({ id, data }: ExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const currentFolder = useMemo(
    () => (Array.isArray(data) ? null : data),
    [data]
  );

  const folders = useMemo(
    () => (Array.isArray(data) ? data : currentFolder?.children || []),
    [data, currentFolder]
  );

  const files = useMemo(
    () => (Array.isArray(data) ? [] : currentFolder?.files || []),
    [data, currentFolder]
  );

  const filteredFolders = useMemo(
    () =>
      folders.filter((folder) =>
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [folders, searchQuery]
  );

  const filteredFiles = useMemo(
    () =>
      files.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [files, searchQuery]
  );

  const handleNavigateToFolder = (folderId: string) => {
    router.push(`?id=${encodeURIComponent(folderId)}`);
  };

  const handleNavigateBack = () => {
    const parentId = Array.isArray(data) ? null : data?.parentId;
    router.push(parentId ? `?id=${encodeURIComponent(parentId)}` : "/");
  };

  const title = Array.isArray(data) ? "Root" : data?.name || "Root";
  const showBackButton = !!searchParams.get("id");
  const isEmptyState = !filteredFolders.length && !filteredFiles.length;
  const hasData = !!data;

  if (!hasData) {
    return <EmptyState message="No files or folders found" />;
  }

  return (
    <div className="space-y-4">
      <ExplorerHeader
        title={title}
        showBackButton={showBackButton}
        onBackClick={handleNavigateBack}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <FileActions parentId={id} />
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
      </ExplorerHeader>

      {isEmptyState ? (
        <EmptyState message="No results found" />
      ) : (
        <>
          {filteredFolders.length > 0 && (
            <section aria-labelledby="folders-section">
              <h3
                id="folders-section"
                className="text-sm font-medium text-muted-foreground"
              >
                Folders
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {filteredFolders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    onNavigate={handleNavigateToFolder}
                  />
                ))}
              </div>
            </section>
          )}

          {filteredFiles.length > 0 && (
            <section aria-labelledby="files-section">
              <h3
                id="files-section"
                className="text-sm font-medium text-muted-foreground"
              >
                Files
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {filteredFiles.map((file) => (
                  <FileCard key={file.id} file={file} folderId={id} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
