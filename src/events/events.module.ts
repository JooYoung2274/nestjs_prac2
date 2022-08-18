import { Module } from "@nestjs/common";
import { EventsGateway } from "./events.gateway";

@Module({
  providers: [EventsGateway],
  exports: [EventsGateway], //EventModule을 다른 모듈에서 imports하고 쓰려면 여기서 exports:[]에 담아줘야함
})
export class EventsModule {}
