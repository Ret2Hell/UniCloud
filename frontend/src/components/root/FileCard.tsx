import React from "react";
import { Card } from "../ui/card";
import { File } from "lucide-react";
import { formatDate } from "@/lib/utils";

const FileCard = ({ file }: FileCardProps) => {
  return (
    <Card className="p-4 hover:bg-accent transition-colors">
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
  );
};

export default FileCard;
