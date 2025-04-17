import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Bookmark,
  BookmarkCheck,
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
import {
  useDeleteFileMutation,
  useDownloadPdfMutation,
  useToggleBookmarkMutation,
} from "@/state/api";

const FileCard = ({ folderId, file }: FileCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const [downloadPdf] = useDownloadPdfMutation();
  const [deleteFile] = useDeleteFileMutation();

  const handleDownload = async () => {
    try {
      const result = await downloadPdf(file.id).unwrap();

      if (!result || !(result instanceof Blob)) {
        throw new Error("Invalid blob received");
      }

      const url = window.URL.createObjectURL(result);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };
  const handleDelete = () => {
    deleteFile({ fileId: file.id, folderId })
      .unwrap()
      .then(() => {
        console.log("File deleted successfully");
      })
      .catch((err) => {
        console.error("Delete failed", err);
      })
      .finally(() => {
        setIsDeleteDialogOpen(false);
      });
  };

  const [toggleBookmark] = useToggleBookmarkMutation();
  const handleToggle = () => {
    toggleBookmark({ fileId: file.id, folderId })
      .unwrap()
      .then(() => {
        console.log("Bookmark toggled successfully");
      })
      .catch((err) => {
        console.error("Toggle bookmark failed", err);
      });
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
              <DropdownMenuItem
                className="cursor-pointer text-green-500 focus:text-green-500"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4 text-green-500" />
                <span>Download</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-pink-500 focus:text-pink-500"
                onClick={handleToggle}
              >
                {file.isBookmarked ? (
                  <BookmarkCheck className="mr-2 h-4 w-4 text-pink-500" />
                ) : (
                  <Bookmark className="mr-2 h-4 w-4 text-pink-500" />
                )}
                <span>Bookmark</span>
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
        fileId={file.id}
        fileName={file.name}
      />
    </Card>
  );
};

export default FileCard;
