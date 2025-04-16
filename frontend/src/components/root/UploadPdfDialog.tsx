import { FileUploadFormData, fileUploadSchema } from "@/lib/schemas";
import { useUploadPdfMutation } from "@/state/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { CustomFormField } from "../CustomFormField";
import { Button } from "../ui/button";

const UploadPdfDialog = ({ parentId, onClose }: UploadPdfDialogProps) => {
  const [uploadPdf, { isLoading }] = useUploadPdfMutation();
  const form = useForm<FileUploadFormData>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: { file: null },
  });

  const handleSubmit: SubmitHandler<FileUploadFormData> = async (data) => {
    try {
      await uploadPdf({
        file: data.file as File,
        folderId: parentId,
      }).unwrap();

      form.reset();
      onClose();
    } catch (error) {
      console.error("Failed to upload file:", error);
      form.setError("file", {
        type: "manual",
        message: "Failed to upload file. Please try again.",
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Upload PDF File</DialogTitle>
        <DialogDescription>
          Select a PDF file to upload to {parentId ? "this folder" : "root"}.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
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
              disabled={isLoading}
              onClick={() => {
                onClose();
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !form.watch("file")}>
              {isLoading ? "Uploading..." : "Upload File"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UploadPdfDialog;
