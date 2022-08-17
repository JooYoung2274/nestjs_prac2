import { Injectable } from "@nestjs/common";
import { JoinRequestDto } from "src/users/dto/join.request.dto";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  // async loginGoogleOauth(req: any) {
  //   const userFromUserService = await this.usersService.findOne(req.user.email);

  //   const newUser: JoinRequestDto = {
  //     email: req.user.email,
  //     accessToken: req.user.accessToken,
  //   };

  //   await this.usersService.create(newUser);
  //   const result = await this.login(newUser);
  //   return result;
  // }

  // async login(newUser: JoinRequestDto) {
  //   const result = this.jwtService.sign(
  //     {
  //       email: newUser.email,
  //     },
  //     {
  //       secret: process.env.JWT_SECRET_KEY,
  //       expiresIn: process.env.JWT_EXPIRE_TIME,
  //     },
  //   );
  //   return result;
  // }
}
