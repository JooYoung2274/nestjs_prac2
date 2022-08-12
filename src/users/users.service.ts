import { Injectable } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';

@Injectable()
export class UsersService {
  async postUsers(email: string) {}

  async findOne(email: string) {
    return;
  }

  async create(newUser: JoinRequestDto) {}
}
