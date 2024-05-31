import { IsNotEmpty, IsString } from "class-validator"

export class LoginDTO {
  @IsString()
  email: string

  @IsString()
  phone: string

  @IsString()
  @IsNotEmpty()
  password: string
}