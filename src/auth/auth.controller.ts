import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { success } from 'src/utils';
import { LoginDTO, RegisterDTO } from './DTO';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("register")
  async register(@Body() registerDTO: RegisterDTO) {
    await this.authService.register(registerDTO)

    return success("Successfully registered")
  }

  @Post("login")
  async login(@Body() loginDTO: LoginDTO) {
    const token = await this.authService.login(loginDTO)

    return success("“Successfully logged in", {
      token
    })
  }
}
