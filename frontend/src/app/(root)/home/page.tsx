"use client";

import Explorer from "@/components/root/Explorer";
import ExplorerSkeleton from "@/components/root/ExplorerSkeleton";
import { useGetFolderByIdQuery, useGetRootFoldersQuery } from "@/state/api";
import { useSearchParams } from "next/navigation";
import React from "react";

const HomePage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const folderByIdQuery = useGetFolderByIdQuery(id, { skip: !id });
  const rootFoldersQuery = useGetRootFoldersQuery({}, { skip: !!id });

  const isLoading = folderByIdQuery.isLoading || rootFoldersQuery.isLoading;

  if (isLoading) {
    return <ExplorerSkeleton />;
  }

  const data = id ? folderByIdQuery.data.folder : rootFoldersQuery.data.folders;

  return (
    <main className="mx-4 flex-1 p-6 w-full relative">
      <Explorer id={id} data={data} />
    </main>
  );
};

export default HomePage;
