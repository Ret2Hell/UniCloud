import React from "react";
import { Card } from "../ui/card";
import { Folder } from "lucide-react";
import { formatDate } from "@/lib/utils";

const FolderCard = ({ folder, onNavigate }: FolderCardProps) => {
  return (
    <Card
      role="button"
      tabIndex={0}
      className="p-4 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onClick={() => onNavigate(folder.id)}
      onKeyDown={(e) => e.key === "Enter" && onNavigate(folder.id)}
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
  );
};

export default FolderCard;
