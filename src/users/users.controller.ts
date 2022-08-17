import { Body, Controller, Get, Post, Req, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "src/auth-local/local-auth.guard";
import { User } from "src/common/decorators/user.decorator";
import { UserDto } from "src/common/dto/user.dto";
import { UndefinedToNullInterceptor } from "src/common/interceptors/undefinedToNull.interceptor";
import { JoinRequestDto } from "./dto/join.request.dto";
import { UsersService } from "./users.service";

@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags("users")
@Controller("api/users")
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiResponse({
    type: UserDto,
  })
  @ApiOperation({ summary: "내 정보조회" })
  @Get()
  getUsers(@User() user) {
    return user;
  }

  @ApiOperation({ summary: "회원가입" })
  @Post()
  async join(@Body() body: JoinRequestDto) {
    await this.userService.join(body.email, body.nickname, body.password);
    return;
  }

  @ApiResponse({
    status: 200,
    description: "성공",
    type: UserDto,
  })
  @ApiResponse({
    status: 500,
    description: "서버에러",
  })
  @ApiOperation({ summary: "로그인" })
  @UseGuards(LocalAuthGuard)
  @Post("login")
  logIn(@User() user) {
    return user;
  }

  @ApiOperation({ summary: "로그아웃" })
  @Post("logout")
  logOut(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie("connect.sid", { httpOnly: true });
    res.send("ok");
  }
}
