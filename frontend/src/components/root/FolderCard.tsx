import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Folder, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Trash2 } from "lucide-react";
import CardInfo from "./CardInfo";
import ConfirmationDialog from "./ConfirmationDialog";

const FolderCard = ({ folder, onNavigate }: FolderCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    // Delete API call to delete the folder (imported from RTK query)
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      className="p-4 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onDoubleClick={() => onNavigate(folder.id)}
      onKeyDown={(e) => e.key === "Enter" && onNavigate(folder.id)}
    >
      <div className="flex items-start space-x-3">
        <Folder className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
        <CardInfo name={folder.name} date={folder.createdAt} />
        <div className="flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-200/80 transition-colors">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Folder"
        description={`Are you sure you want to delete "${folder.name}"? This action cannot be undone and will delete all contents inside this folder.`}
        onConfirm={handleDelete}
      />
    </Card>
  );
};

export default FolderCard;
