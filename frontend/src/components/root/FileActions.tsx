"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { FolderPlus, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

import CreateFolderDialog from "./CreateFolderDialog";
import UploadPdfDialog from "./UploadPdfDialog";

export default function FileActions({ parentId, className }: FileActionsProps) {
  const [dialogOpen, setDialogOpen] = useState<"folder" | "file" | null>(null);

  return (
    <div className={cn("flex gap-2", className)}>
      {/* New Folder Dialog */}
      <Dialog
        open={dialogOpen === "folder"}
        onOpenChange={(open) => setDialogOpen(open ? "folder" : null)}
      >
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </DialogTrigger>
        <CreateFolderDialog
          parentId={parentId}
          onClose={() => setDialogOpen(null)}
        />
      </Dialog>

      {/* Upload File Dialog */}

      {parentId && (
        <Dialog
          open={dialogOpen === "file"}
          onOpenChange={(open) => setDialogOpen(open ? "file" : null)}
        >
          <DialogTrigger asChild>
            <Button variant="default" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload PDF
            </Button>
          </DialogTrigger>
          <UploadPdfDialog
            parentId={parentId}
            onClose={() => setDialogOpen(null)}
          />
        </Dialog>
      )}
    </div>
  );
}
