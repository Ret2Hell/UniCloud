import { FolderCreateFormData, folderCreateSchema } from "@/lib/schemas";
import { useCreateFolderMutation } from "@/state/api";
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
import { CustomFormField } from "../CustomFormField";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

const CreateFolderDialog = ({ parentId, onClose }: CreateFolderDialogProps) => {
  const [createFolder, { isLoading }] = useCreateFolderMutation();
  const form = useForm<FolderCreateFormData>({
    resolver: zodResolver(folderCreateSchema),
    defaultValues: { name: "" },
  });

  const handleSubmit: SubmitHandler<FolderCreateFormData> = async (data) => {
    try {
      await createFolder({
        name: data.name,
        parentId: parentId || undefined,
      }).unwrap();
      form.reset();
      onClose();
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogDescription>Enter a name for your new folder.</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <div className="py-4">
            <CustomFormField
              name="name"
              label="Folder Name"
              type="text"
              placeholder="My Folder"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Folder"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default CreateFolderDialog;
