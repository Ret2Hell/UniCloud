import * as z from "zod";

// User Registration Schema
export const userRegistrationSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .max(20, "Username must be at most 20 characters long"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type UserRegistrationFormData = z.infer<typeof userRegistrationSchema>;
// User Login Schema

export const userLoginSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.password.length > 0, {
    message: "Password is required",
  });
export type UserLoginFormData = z.infer<typeof userLoginSchema>;

// Folder create schema (parentId and name)
export const folderCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Folder name is required")
    .max(50, "Folder name must be at most 50 characters long"),
});

export type FolderCreateFormData = z.infer<typeof folderCreateSchema>;

export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .nullable()
    .refine(
      (file) =>
        file === null ||
        (file.type === "application/pdf" && file.size < 10 * 1024 * 1024),
      {
        message: "Only PDF files under 10 MB are allowed.",
      }
    ),
});

export type FileUploadFormData = z.infer<typeof fileUploadSchema>;
