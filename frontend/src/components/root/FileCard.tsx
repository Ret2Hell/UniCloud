import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Download,
  File,
  MessageSquare,
  MoreVertical,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CardInfo from "./CardInfo";
import ConfirmationDialog from "./ConfirmationDialog";
import AiChat from "./AiChat";

const FileCard = ({ file }: FileCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const handleDelete = () => {
    // Delete logic here
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card className="p-4 hover:bg-accent transition-colors">
      <div className="flex items-start space-x-3">
        <File className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
        <CardInfo name={file.name} date={file.createdAt} />
        <div className="flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-200/80 transition-colors">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer text-green-500 focus:text-green-500">
                <Download className="mr-2 h-4 w-4 text-green-500" />
                <span>Download</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-blue-500 focus:text-blue-500"
                onClick={() => setIsAiDialogOpen(true)}
              >
                <MessageSquare className="mr-2 h-4 w-4 text-blue-500" />
                <span>Ask AI</span>
              </DropdownMenuItem>
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
        title="Delete File"
        description={`Are you sure you want to delete "${file.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />

      <AiChat
        isOpen={isAiDialogOpen}
        onOpenChange={setIsAiDialogOpen}
        fileName={file.name}
      />
    </Card>
  );
};

export default FileCard;
