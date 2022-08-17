import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { Users } from "../entities/Users";

@Injectable()
export class AuthLocalService {
  constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ["id", "email", "password"], //password는 entitiy에서 select:false라서 불러오려면 select해줘야함
    });
    console.log(email, password, user);
    if (!user) {
      return null;
    }
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }
}
