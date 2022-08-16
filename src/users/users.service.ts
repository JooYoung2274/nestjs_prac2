import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { JoinRequestDto } from './dto/join.request.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async join(email: string, nickname: string, password: string) {
    if (!email) {
      throw new HttpException('email X', 400);
    }
    if (!nickname) {
      throw new HttpException('nickname X', 400);
    }
    if (!password) {
      throw new HttpException('password X', 400);
    }

    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      throw new HttpException('USER_EXISTS', 401);
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
