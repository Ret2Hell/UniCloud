import { FolderOpen } from "lucide-react";
import React from "react";

const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <FolderOpen className="h-16 w-16 text-muted-foreground" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default EmptyState;
