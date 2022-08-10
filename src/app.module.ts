import { Module } from '@nestjs/common';
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { response } from 'express';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
