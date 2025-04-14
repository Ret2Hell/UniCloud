declare global {
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
