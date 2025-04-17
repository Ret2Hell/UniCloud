import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { toast } from "sonner";
import { clearId } from ".";

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraOptions: any
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    credentials: "include",
  });
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await baseQuery(args, api, extraOptions);
    if (result.error) {
      if (result.error.status === 401) {
        document.cookie = "access_token=; Max-Age=0; path=/";
        toast.error("Session expired. Please log in again.");
        clearId();

        await new Promise((resolve) => setTimeout(resolve, 2000));
        window.location.href = "/login";
      } else {
        const errorData = result.error.data;
        const errorMessage =
          errorData?.message ||
          result.error.status.toString() ||
          "An error occurred";
        toast.error(`Error: ${errorMessage}`);
      }
    }

    const isMutationRequest =
      (args as FetchArgs).method && (args as FetchArgs).method !== "GET";
    if (isMutationRequest) {
      const toastMeta = extraOptions?.meta?.toast;

      if (toastMeta) {
        if (result.error && toastMeta.showError !== false) {
          toast.error(toastMeta.errorMessage || "Something went wrong");
        }

        if (!result.error && toastMeta.showSuccess !== false) {
          toast.success(toastMeta.successMessage || "Success!");
        }
      }
      const successMessage = result.data?.message;
      if (successMessage) toast.success(successMessage);
    }

    if (result.data) {
      result.data = result.data.data;
    } else if (
      result.error?.status === 204 ||
      result.meta?.response?.status === 24
    ) {
      return { data: null };
    }
    return result;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return { error: { status: "FETCH_ERROR", error: errorMessage } };
  }
};

export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: ["User", "Folder", "File"],
  endpoints: (builder) => ({
    /*
    =================
    USER ENDPOINTS
    =================
    */
    getUser: builder.query({
      query: () => ({
        url: "/api/auth/user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    register: builder.mutation({
      query: (registerData) => ({
        url: "/api/auth/sign-up",
        method: "POST",
        body: registerData,
      }),
    }),
    login: builder.mutation({
      query: (loginData) => ({
        url: "/api/auth/sign-in",
        method: "POST",
        body: loginData,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    /*
    =================
    FOLDERS ENDPOINTS GRAPHQL
    =================
    */
    getRootFolders: builder.query({
      query: () => ({
        url: "/graphql",
        method: "POST",
        body: {
          query: `query {
            folders {
            id
            name
            parentId
            createdAt
            updatedAt
            }
          }`,
        },
      }),
      providesTags: (result) =>
        result?.data?.folders
          ? [
              ...result.data.folders.map((folder: Folder) => ({
                type: "Folder" as const,
                id: folder.id,
              })),
              { type: "Folder", id: "LIST" },
            ]
          : [{ type: "Folder", id: "LIST" }],
    }),
    getFolderById: builder.query({
      query: (id) => ({
        url: "/graphql",
        method: "POST",
        body: {
          query: `query {
            folder(id: "${id}") {
              id
              name
              parentId    
              children {
                id
                name
                createdAt
                updatedAt
              }
              files {
                id
                name
                size
                path
                createdAt
                updatedAt
              }
            }
          }`,
        },
      }),
      providesTags: (result, error, id) => [
        { type: "Folder", id },
        { type: "File", id },
        { type: "Folder", id: "LIST" },
      ],
    }),
    createFolder: builder.mutation({
      query: (folderData) => ({
        url: "/graphql",
        method: "POST",
        body: {
          query: `mutation {
          createFolder (input: {
          ${folderData.parentId ? `parentId: "${folderData.parentId}"` : ""}
          name: "${folderData.name}"
          })
          {
            id,
            name
          }
        }`,
        },
      }),
      invalidatesTags: [{ type: "Folder", id: "LIST" }],
      extraOptions: {
        meta: {
          toast: {
            showSuccess: true,
            showError: true,
            successMessage: "Folder created successfully!",
            errorMessage: "Failed to create folder!",
          },
        },
      },
    }),
    uploadPdf: builder.mutation<
      { id: string },
      { file: File; folderId?: string | null }
    >({
      query: ({ file, folderId }) => {
        const formData = new FormData();

        formData.append(
          "operations",
          JSON.stringify({
            query: `
              mutation ($file: Upload!, $folderId: String!) {
                uploadPdf(folderId: $folderId, file: $file) {
                  id
                }
              }
            `,
            variables: {
              file: null,
              folderId,
            },
          })
        );

        formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
        formData.append("0", file);
        return {
          url: "/graphql",
          method: "POST",
          body: formData,
          headers: {
            "x-apollo-operation-name": "UploadFile",
          },
        };
      },
      invalidatesTags: (result, error, { folderId }) => {
        if (folderId) {
          return [{ type: "Folder", id: folderId }];
        }
        return [];
      },
      extraOptions: {
        meta: {
          toast: {
            showSuccess: true,
            showError: true,
            successMessage: "File uploaded successfully!",
            errorMessage: "Failed to upload file!",
          },
        },
      },
    }),
    downloadPdf: builder.mutation({
      query: (id) => ({
        url: `api/files/download/${id}`,
        responseHandler: async (response) => {
          const blob = await response.blob();
          return { data: blob };
        },
        method: "POST",
        cache: "no-cache",
      }),
    }),
    deleteFile: builder.mutation<
      boolean,
      { fileId: string; folderId?: string | null }
    >({
      query: ({ fileId }) => ({
        url: "/graphql",
        method: "POST",
        body: {
          query: `
            mutation DeleteFile($fileId: String!) {
              deleteFile(fileId: $fileId)
            }
          `,
          variables: {
            fileId,
          },
        },
      }),
      invalidatesTags: (result, error, { folderId }) => {
        if (folderId) {
          return [{ type: "File", id: folderId }];
        }
        return [];
      },
      extraOptions: {
        meta: {
          toast: {
            showSuccess: true,
            showError: true,
            successMessage: "File deleted successfully!",
            errorMessage: "Failed to delete file!",
          },
        },
      },
    }),
    deleteFolder: builder.mutation<
      boolean,
      { id: string; parentId?: string | null }
    >({
      query: ({ id }) => ({
        url: "/graphql",
        method: "POST",
        body: {
          query: `
          mutation DeleteFolder($id: String!) {
            deleteFolder(folderId: $id)
          }
        `,
          variables: { id },
        },
      }),
      invalidatesTags: (result, error, { parentId }) => {
        if (parentId) {
          return [{ type: "Folder", id: parentId }];
        }
        return [{ type: "Folder", id: "LIST" }];
      },
      extraOptions: {
        meta: {
          toast: {
            showSuccess: true,
            showError: true,
            successMessage: "Folder deleted successfully!",
            errorMessage: "Failed to delete folder!",
          },
        },
      },
    }),
    sendMessage: builder.mutation<
      AiResponse,
      {
        content: string;
        fileId: string;
      }
    >({
      query: ({ content, fileId }) => ({
        url: "graphql",
        method: "POST",
        body: {
          query: `
            mutation SendMessage($content: String!, $fileId: String!) {
              sendMessage(content: $content, fileId: $fileId) {
                role
                content
              }
            }
          `,
          variables: { content, fileId },
        },
      }),
      transformResponse: (response: { sendMessage: AiResponse }) =>
        response.sendMessage,
    }),
  }),
});

export const {
  useGetUserQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetRootFoldersQuery,
  useGetFolderByIdQuery,
  useCreateFolderMutation,
  useUploadPdfMutation,
  useDownloadPdfMutation,
  useDeleteFileMutation,
  useDeleteFolderMutation,
  useSendMessageMutation,
} = api;
