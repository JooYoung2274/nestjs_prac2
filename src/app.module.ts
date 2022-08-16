import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from 'middlewares/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';

import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelChats } from './entities/ChannelChats';
import { ChannelMembers } from './entities/ChannelMembers';
import { Channels } from './entities/Channels';
import { DMs } from './entities/DMs';
import { Mentions } from './entities/Mentions';
import { Users } from './entities/Users';
import { WorkspaceMembers } from './entities/WorkspaceMembers';
import { Workspaces } from './entities/Workspaces';

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
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    WorkspacesModule,
    ChannelsModule,
    DmsModule,
    AuthModule,
    // configService를 사용하기위해서 forRootAsync 사용.
    // 지금은 .env에서 받아왔지만 나중에 ConfigModule.forRoot({ isGlobal: true, load:[getData] })
    // getData에서 return된 데이터도 사용가능 함. (aws 보안저장소 같은 곳)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [
            ChannelChats,
            ChannelMembers,
            Channels,
            DMs,
            Mentions,
            Users,
            WorkspaceMembers,
            Workspaces,
          ],
          migrations: [__dirname + '/src/migrations/*.ts'], // 지금은 필요없음
          cli: { migrationsDir: 'src/migrations' }, // 지금은 필요없음
          autoLoadEntities: true,
          charset: 'utf8mb4',
          synchronize: false, // dev 환경일때만 사용 (한번 true로 하고, false로 변경)
          logging: true, // query 날리는것 로깅
          keepConnectionAlive: true, //hot reloading 할때 필요
        };
      },
    }), // typeorm import
  ],
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
