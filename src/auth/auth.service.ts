import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { RegisterDTO } from './DTO/RegisterDTO';
import { ResponseErrorCode, fail } from 'src/utils';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) { }

  async register({ name, email, phone, password }: RegisterDTO) {
    if (email !== "") {
      if (email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) === null) {
        throw new BadRequestException(fail("Invalid email", ResponseErrorCode.ERR_2))
      }

      if (await this.findUserByEmail(email) !== null) {
        throw new ConflictException(fail("User with the given email already exists", ResponseErrorCode.ERR_0))
      }
    } else {
      if (phone.match(/^08\d{8,11}$/) === null) {
        throw new BadRequestException(fail("Invalid phone number", ResponseErrorCode.ERR_3))
      }

      if (await this.findUserByPhone(phone) !== null) {
        throw new ConflictException(fail("User with the given phone number already exists", ResponseErrorCode.ERR_1))
      }
    }

    const encryptedPassword = bcrypt.hashSync(password, 10)
    await this.prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: encryptedPassword
      }
    })
  }

  private async findUserByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } })
  }

  private async findUserByPhone(phone: string) {
    return this.prisma.user.findFirst({ where: { phone } })
  }
}
