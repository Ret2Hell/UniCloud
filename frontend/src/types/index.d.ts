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
