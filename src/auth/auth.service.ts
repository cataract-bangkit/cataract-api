import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './DTO';
import { RequestUser, ResponseErrorCode, fail } from 'src/utils';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) { }

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

  async login({ email, phone, password }: LoginDTO) {
    let encryptedPassword: string
    let name: string
    if (email !== "") {
      if (email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) === null) {
        throw new BadRequestException(fail("Invalid email, phone number, or password", ResponseErrorCode.ERR_4))
      }

      const user = await this.findUserByEmail(email)
      if (user === null) {
        throw new BadRequestException(fail("Invalid email, phone number, or password", ResponseErrorCode.ERR_4))
      }

      encryptedPassword = user.password
      name = user.name
    } else {
      if (phone.match(/^08\d{8,11}$/) === null) {
        throw new BadRequestException(fail("Invalid email, phone number, or password", ResponseErrorCode.ERR_4))
      }

      const user = await this.findUserByPhone(phone)
      if (user === null) {
        throw new BadRequestException(fail("Invalid email, phone number, or password", ResponseErrorCode.ERR_4))
      }

      encryptedPassword = user.password
      name = user.name
    }

    if (bcrypt.compareSync(password, encryptedPassword)) {
      const token = this.refresh({name, email, phone})

      return token
    } else {
      throw new BadRequestException(fail("Invalid email, phone number, or password", ResponseErrorCode.ERR_4))
    }
  }

  refresh({ name, email, phone }: RequestUser) {
    const token = this.jwtService.sign({
      sub: email ?? phone,
      name,
      email,
      phone
    })

    return token
  }

  private async findUserByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } })
  }

  private async findUserByPhone(phone: string) {
    return this.prisma.user.findFirst({ where: { phone } })
  }
}
