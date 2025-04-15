import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { toast } from "sonner";
import { clearId } from ".";

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
  tagTypes: ["User", "Folders"],
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
      providesTags: ["Folders"],
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
      invalidatesTags: ["Folders"],
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
} = api;
