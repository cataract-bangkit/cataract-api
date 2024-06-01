import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);

export type RequestUser = {
  name: string,
  email: string,
  phone: string
}

export const ReqUser = createParamDecorator(
  (_: undefined, context: ExecutionContext): RequestUser => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
