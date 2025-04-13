import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { User } from '@prisma/client';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true; // Allow access to public routes
    }
    return super.canActivate(context); // Protect other routes
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
