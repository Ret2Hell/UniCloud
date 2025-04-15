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
import { Request, Response } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext): Request {
    const contextType = context.getType<'http' | 'graphql'>();

    if (contextType === 'http') {
      return context.switchToHttp().getRequest<Request>();
    }

    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<{ req: Request }>().req;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = User>(
    err: unknown,
    user: TUser,
    info: any,
    context: ExecutionContext,
  ): TUser {
    if (err || !user) {
      if (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('JWT Authentication Error:', errorMessage);
      }

      // Clear authentication cookie
      this.clearAuthCookie(context);

      throw new UnauthorizedException(
        err instanceof Error
          ? err.message
          : 'Invalid or expired authorization token',
      );
    }
    return user;
  }

  private clearAuthCookie(context: ExecutionContext) {
    try {
      const contextType = context.getType<'http' | 'graphql'>();
      let response: Response;

      if (contextType === 'http') {
        response = context.switchToHttp().getResponse<Response>();
      } else {
        const gqlContext = GqlExecutionContext.create(context).getContext<{
          res: Response;
        }>();
        response = gqlContext.res;
      }

      if (response && typeof response.clearCookie === 'function') {
        response.clearCookie('access_token', {
          // Replace with your cookie name
          httpOnly: true,
          path: '/',
          // Add other cookie options if needed (e.g., secure, sameSite, domain)
        });
      }
    } catch (error) {
      console.error('Error clearing authentication cookie:', error);
    }
  }
}
