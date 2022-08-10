import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Hot reload 추가
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`listening on port ${port}`);

  // Hot reload 추가
  // 공식문서 확인
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
