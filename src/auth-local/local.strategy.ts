import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthLocalService } from './auth-local.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authLocalService: AuthLocalService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string, done: CallableFunction) {
    const user = await this.authLocalService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return done(null, user);
  }
}
