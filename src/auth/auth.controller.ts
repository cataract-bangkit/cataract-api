import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic, ReqUser, RequestUser, success } from 'src/utils';
import { LoginDTO, RegisterDTO } from './DTO';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @IsPublic()
  @Post("register")
  async register(@Body() registerDTO: RegisterDTO) {
    await this.authService.register(registerDTO)

    return success("Successfully registered")
  }

  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @Post("login")
  async login(@Body() loginDTO: LoginDTO) {
    const token = await this.authService.login(loginDTO)

    return success("Successfully logged in", {
      token
    })
  }

  @HttpCode(HttpStatus.OK)
  @Post("refresh")
  async refresh(@ReqUser() user: RequestUser) {
    const token = this.authService.refresh(user)
    return success("Successfully refreshed", {
      token
    })
  }
}
