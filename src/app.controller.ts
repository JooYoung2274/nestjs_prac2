import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, // @Inject('CUSTOM_PROVIDER') private customValue,
  ) // 만약 custom_provider를 DI하고 싶으면 이렇게 @Inject로. AppService의 경우 그냥 []안에 써줘도 알아서 주입됨
  {}

  @Get()
  async getHello(): Promise<string> {
    const user = await this.appService.getHello();
    return user;
  }
}
