import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from 'middlewares/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';

// test2
// AWS 저장소에서 비밀키 불러올때 아래처럼
// const getEnv = async () => {
//   // aws 보안저장소에서 비밀키 불러와서 load해주면 비동기로 사용 가능.
//   const response = axios.get('dfsdfsdf');
//   return response.data;
// };

// @Module({
//   imports: [ConfigModule.forRoot({ isGlobal: true, load: [getEnv] })],
//   controllers: [AppController],
//   providers: [AppService, ConfigService],
// })

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, WorkspacesModule, ChannelsModule, DmsModule],
  controllers: [AppController],
  providers: [AppService, ConfigService],

  // // 만약 커스텀 provider를 사용해야 한다면 아래처럼
  // providers: [
  //   {
  //     provide: 'CUSTOM_PROVIDER',
  //     useValue: 'value', // useValue or useClass or useFactory
  //   },
  // ],
})
// NestModule 은 Logger 때문에 추가
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
