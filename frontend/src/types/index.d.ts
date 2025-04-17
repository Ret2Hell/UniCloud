declare global {
  interface LayoutProps {
    children: ReactNode;
  }

  interface FormNavigationProps {
    mainActionLabel: string;
    secondaryAction: {
      label: string;
      href: string;
    };
    isLoading?: boolean;
  }

  interface AuthHeaderProps {
    title: string;
    description: string;
  }

  interface NavItemProps {
    children: React.ReactNode;
    href: string;
    name: string;
    isCollapsed: boolean;
  }

  interface FileActionsProps {
    parentId?: string | null;
    onFolderCreated?: () => void;
    onFileUploaded?: () => void;
    className?: string;
  }

  interface DialogProps {
    parentId?: string | null;
    onClose: () => void;
  }

  type CreateFolderDialogProps = DialogProps;

  interface UploadPdfDialogProps extends DialogProps {
    parentId: string;
  }

  interface FileItem {
    id: string;
    name: string;
    size: number;
    path: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface FolderItem {
    id: string;
    name: string;
    parentId?: string | null;
    files?: FileItem[];
    folders?: FolderItem[];
    createdAt: Date;
    updatedAt: Date;
  }
  interface FolderCardProps {
    folder: FolderItem;
    parentId?: string | null;
    onNavigate: (id: string) => void;
  }

  interface FileCardProps {
    folderId?: string | null;
    file: FileItem;
  }

  interface ExplorerProps {
    id?: string | null;
    data?:
      | {
          id: string;
          name: string;
          parentId?: string | null;
          files?: FileItem[];
          children?: FolderItem[];
        }
      | FolderItem[];
    isLoading?: boolean;
  }

  interface ExplorerHeaderProps {
    title: string;
    showBackButton: boolean;
    onBackClick: () => void;
    children?: React.ReactNode;
  }

  interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
  }

  interface AiChatProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    fileId: string;
    fileName: string;
  }

  interface ConfirmationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
  }

  interface CardInfoProps {
    name: string;
    date: Date;
  }

  interface AiResponse {
    role: "user" | "assistant";
    content: string;
  }

  interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }
  type CreateUserArgs = Omit<User, "userId">;
}

export {};
