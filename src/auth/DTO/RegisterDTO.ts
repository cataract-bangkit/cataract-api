import { IsNotEmpty, IsString } from "class-validator"

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  email: string

  @IsString()
  phone: string

  @IsString()
  @IsNotEmpty()
  password: string
}