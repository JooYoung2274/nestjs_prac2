import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./httpException.filter";
import passport from "passport";
// Hot reload 추가
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Swagger 추가
  const config = new DocumentBuilder()
    .setTitle("slack_clone API")
    .setDescription("slack_clone coding API Document")
    .setVersion("1.0")
    .addCookieAuth("connect.sid")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const port = process.env.PORT || 3000;
  app.useGlobalPipes(new ValidationPipe()); // class-validator
  app.useGlobalFilters(new HttpExceptionFilter()); // exception filter

  app.use(passport.initialize()); // session 사용하려면 해당 미들웨어 필요
  app.use(passport.session());

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
