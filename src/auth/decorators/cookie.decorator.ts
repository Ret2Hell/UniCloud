import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';

export const Cookie = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Response => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.res as Response;
  },
);
