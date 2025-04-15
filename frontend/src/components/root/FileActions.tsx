"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { FolderPlus, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomFormField } from "../CustomFormField";
import { Form } from "../ui/form";
import { useCreateFolderMutation } from "@/state/api";
import { FolderCreateFormData, folderCreateSchema } from "@/lib/schemas";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus } from "lucide-react";

interface FileActionsProps {
  folderId?: string | null;
  onFolderCreated?: () => void;
  onFileUploaded?: () => void;
  className?: string;
}

export default function FileActions({ folderId, className }: FileActionsProps) {
  const [newFolderOpen, setNewFolderOpen] = useState(false);

  const [createFolder, { isLoading }] = useCreateFolderMutation();

  const methods = useForm<FolderCreateFormData>({
    resolver: zodResolver(folderCreateSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: SubmitHandler<FolderCreateFormData> = async (
    data: FolderCreateFormData
  ) => {
    try {
      const { name } = data;
      console.log("Creating folder with data:", data);
      const response = await createFolder({
        parentId: folderId || undefined,
        name,
      }).unwrap();
      console.log("Folder created:", response);
      setNewFolderOpen(false);
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  return (
    <div className={cn("flex gap-2", className)}>
      {/* New Folder Dialog */}
      <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for your new folder.
            </DialogDescription>
          </DialogHeader>
          <Form {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
              <div className="py-4">
                <CustomFormField
                  name="name"
                  label="Folder Name"
                  type="text"
                  placeholder="My Folder"
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewFolderOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Folder"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Upload File Dialog */}
      {/* <Dialog open={uploadFileOpen} onOpenChange={setUploadFileOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload PDF
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleFileUpload}>
            <DialogHeader>
              <DialogTitle>Upload PDF File</DialogTitle>
              <DialogDescription>
                Select a PDF file to upload to{" "}
                {folderId ? "this folder" : "root"}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center">
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {selectedFile.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ) : (
                  <>
                    <Label
                      htmlFor="fileUpload"
                      className="flex flex-col items-center gap-2 cursor-pointer"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Click to select a PDF file
                      </span>
                      <span className="text-xs text-muted-foreground">
                        PDF files only, max 10MB
                      </span>
                    </Label>
                    <Input
                      id="fileUpload"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                        }
                      }}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              {uploadProgress > 0 && (
                <div className="w-full">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-right mt-1 text-muted-foreground">
                    {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setUploadFileOpen(false);
                  setSelectedFile(null);
                  setUploadProgress(0);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedFile || isSubmitting}>
                {isSubmitting ? "Uploading..." : "Upload File"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
