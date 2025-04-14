import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from '../dto/jwt.payload.dto';

export const GetUser = createParamDecorator(
  (
    field: keyof JwtPayload | undefined,
    ctx: ExecutionContext,
  ): JwtPayload | string | null => {
    // Determine the context type (HTTP or GraphQL)
    const contextType = ctx.getType<'http' | 'graphql'>();

    let user: JwtPayload;

    if (contextType === 'http') {
      // REST context
      const req = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
      user = req.user;
    } else {
      // GraphQL context
      const gqlContext = GqlExecutionContext.create(ctx);
      const graphqlContext = gqlContext.getContext<{
        req: { user: JwtPayload };
      }>();
      user = graphqlContext.req.user;
    }

    if (!user) {
      return null;
    }

    return field ? user[field] : user;
  },
);
