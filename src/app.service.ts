import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHello(): string {
    // console.log(process.env.SECRET);
    // return process.env.SECRET;
    // process.env 사용하는것보다 configService을 주입받아 사용하는 것이 환경변수도 nest에게 맡기는걸 더 추천 (IoC)
    // 테스트할때도 더 좋음
    console.log(this.configService.get("SECRET"));
    return this.configService.get("SECRET");
  }
}
