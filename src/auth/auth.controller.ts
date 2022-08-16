import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async loginGoogleOauth() {}

  @UseGuards(AuthGuard('google'))
  @Get('/google/redirect')
  async loginGoogleOauthRedirect(@Req() req) {
    // return this.authService.loginGoogleOauth(req);
  }
}
