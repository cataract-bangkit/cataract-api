import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { fail } from 'src/utils';
import { IS_PUBLIC_KEY } from 'src/utils/decorators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prismaService: PrismaService, private jwtService: JwtService, private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(fail("Unauthorized"));
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWT_SECRET
        }
      );

      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.id
        }
      })

      if (!user) throw new UnauthorizedException(fail("Unauthorized"));

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException(fail("Unauthorized"));
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}