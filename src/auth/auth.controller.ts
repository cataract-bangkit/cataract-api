import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './DTO/RegisterDTO';
import { success } from 'src/utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("register")
  async register(@Body() registerDTO: RegisterDTO) {
    await this.authService.register(registerDTO)

    return success("Successfully registered")
  }
}
