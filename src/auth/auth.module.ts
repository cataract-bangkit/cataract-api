import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [
        ConfigModule
      ],
      useFactory: async (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>("JWT_SECRET"),
          signOptions: { expiresIn: '7d' },
        }
      },
      inject: [
        ConfigService
      ]
    })],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, {
    provide: APP_GUARD,
    useClass: AuthGuard,
  }],
})
export class AuthModule { }
