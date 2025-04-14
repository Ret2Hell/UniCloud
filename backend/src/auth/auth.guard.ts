import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { User } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext): Request {
    // Determine the context type
    const contextType = context.getType<'http' | 'graphql'>();

    if (contextType === 'http') {
      // REST context
      return context.switchToHttp().getRequest<Request>();
    }

    // GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const graphqlContext = ctx.getContext<{ req: Request }>();
    return graphqlContext.req;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check for public routes first
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Proceed with standard authentication
    return super.canActivate(context);
  }

  handleRequest<TUser = User>(err: unknown, user: TUser): TUser {
    if (err || !user) {
      if (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('JWT Authentication Error:', errorMessage);
      }
      throw new UnauthorizedException(
        err instanceof Error
          ? err.message
          : 'Invalid or expired authorization token',
      );
    }
    return user;
  }
}
