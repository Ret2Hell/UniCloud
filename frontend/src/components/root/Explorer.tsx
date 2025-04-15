"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { File, Folder, FolderOpen, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import FileActions from "./FileActions";

interface FileItem {
  id: string;
  name: string;
  size: number;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  url?: string;
}

interface FolderItem {
  id: string;
  name: string;
  parentId?: string | null;
  files?: FileItem[];
  folders?: FolderItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface ExplorerProps {
  id?: string | null;
  data?:
    | {
        id: string;
        name: string;
        parentId?: string | null;
        files?: FileItem[];
        children?: FolderItem[];
      }
    | FolderItem[];
  isLoading?: boolean;
}

export default function Explorer({ id, data }: ExplorerProps) {
  console.log(data);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No files or folders found</p>
      </div>
    );
  }

  const currentFolder = Array.isArray(data) ? null : data;
  const folders = Array.isArray(data) ? data : currentFolder?.children || [];
  console.log("Folders:", data);
  const files = Array.isArray(data) ? [] : currentFolder?.files || [];

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFolderClick = (folderId: string) => {
    router.push(`?id=${folderId}`);
  };

  const handleBackClick = () => {
    if (!Array.isArray(data) && data) {
      router.push(data.parentId ? `?id=${data.parentId}` : "/");
    } else {
      router.push("/");
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          {searchParams.get("id") && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackClick}
              className="mr-2"
            >
              Back
            </Button>
          )}
          <h2 className="text-2xl font-bold">
            {!Array.isArray(data) && data.name ? data.name : "Root"}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <FileActions parentId={id} />

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search files and folders..."
              className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredFolders.length === 0 && filteredFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No results found</p>
        </div>
      ) : (
        <>
          {filteredFolders.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Folders
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFolders.map((folder) => (
                  <Card
                    key={folder.id}
                    className="p-4 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleFolderClick(folder.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Folder className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{folder.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(new Date(folder.createdAt))}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filteredFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Files
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFiles.map((file) => (
                  <Link
                    key={file.id}
                    href={file.url || `#file-${file.id}`}
                    target={file.url ? "_blank" : undefined}
                    className="block"
                  >
                    <Card
                      className={cn(
                        "p-4 hover:bg-accent transition-colors",
                        file.url ? "cursor-pointer" : "cursor-default"
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <File className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(new Date(file.createdAt))}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
