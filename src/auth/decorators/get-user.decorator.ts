import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const GetUser = createParamDecorator(
  (
    field: keyof User | undefined,
    ctx: ExecutionContext,
  ): User | string | null => {
    const req = ctx.switchToHttp().getRequest<{ user: User }>();
    const user = req.user;

    if (!user) {
      return null;
    }

    return field ? user[field] : user;
  },
);
