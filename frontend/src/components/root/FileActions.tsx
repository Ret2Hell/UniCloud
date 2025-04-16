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
import { FolderPlus, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomFormField } from "../CustomFormField";
import { Form } from "../ui/form";
import { useCreateFolderMutation, useUploadPdfMutation } from "@/state/api";
import {
  FileUploadFormData,
  fileUploadSchema,
  FolderCreateFormData,
  folderCreateSchema,
} from "@/lib/schemas";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface FileActionsProps {
  parentId?: string | null;
  onFolderCreated?: () => void;
  onFileUploaded?: () => void;
  className?: string;
}

export default function FileActions({ parentId, className }: FileActionsProps) {
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [uploadFileOpen, setUploadFileOpen] = useState(false);

  const [createFolder, { isLoading }] = useCreateFolderMutation();
  const folderMethods = useForm<FolderCreateFormData>({
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
      await createFolder({
        parentId: parentId || undefined,
        name,
      }).unwrap();
      folderMethods.reset();
      setNewFolderOpen(false);
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  const [uploadPdf, { isLoading: isUploading }] = useUploadPdfMutation();
  const fileMethods = useForm<FileUploadFormData>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      file: null,
    },
  });
  const onUpload: SubmitHandler<FileUploadFormData> = async (
    data: FileUploadFormData
  ) => {
    try {
      await uploadPdf({
        file: data.file as File,
        folderId: parentId,
      }).unwrap();

      fileMethods.reset();
      setUploadFileOpen(false);
    } catch (error) {
      console.error("Failed to upload file:", error);
      fileMethods.setError("file", {
        type: "manual",
        message: "Failed to upload file. Please try again.",
      });
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
          <Form {...folderMethods}>
            <form onSubmit={folderMethods.handleSubmit(onSubmit)} noValidate>
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
      <Dialog open={uploadFileOpen} onOpenChange={setUploadFileOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload PDF
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload PDF File</DialogTitle>
            <DialogDescription>
              Select a PDF file to upload to {parentId ? "this folder" : "root"}
              .
            </DialogDescription>
          </DialogHeader>

          <Form {...fileMethods}>
            <form
              onSubmit={fileMethods.handleSubmit(onUpload)}
              encType="multipart/form-data"
              noValidate
            >
              <CustomFormField
                name="file"
                label="Select PDF File"
                type="file"
                placeholder="Choose a PDF file"
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => {
                    setUploadFileOpen(false);
                    fileMethods.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading || !fileMethods.watch("file")}
                >
                  {isUploading ? "Uploading..." : "Upload File"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
