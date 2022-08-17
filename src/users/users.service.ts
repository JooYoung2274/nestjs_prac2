import { BadRequestException, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/entities/Users";
import { Repository } from "typeorm";
import { JoinRequestDto } from "./dto/join.request.dto";
import bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

  async join(email: string, nickname: string, password: string) {
    // class-validator로 dto 단에서 검증 가능
    // if (!email) {
    //   throw new BadRequestException('email X');
    // }
    // if (!nickname) {
    //   throw new BadRequestException('nickname X');
    // }
    // if (!password) {
    //   throw new BadRequestException('password X'); //status 400 error
    // }

    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      throw new UnauthorizedException("USER_EXISTS"); //status 401 error
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
  }

  async findOne(email: string) {
    return;
  }

  async create(newUser: JoinRequestDto) {}
}
