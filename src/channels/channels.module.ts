import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelChats } from "src/entities/ChannelChats";
import { ChannelMembers } from "src/entities/ChannelMembers";
import { Channels } from "src/entities/Channels";
import { Users } from "src/entities/Users";
import { WorkspaceMembers } from "src/entities/WorkspaceMembers";
import { Workspaces } from "src/entities/Workspaces";
import { EventsModule } from "src/events/events.module";
import { ChannelsController } from "./channels.controller";
import { ChannelsService } from "./channels.service";

@Module({
  // EventsModule로 가져와야함
  // EventsGateWay로 가져와서 providers에 넣으면 각 모듈에서 각각 new EventsGateWay()로 인스턴스화 되기 때문에 서버 여러개 생기는 불상사가 일어날수도 있음.
  imports: [TypeOrmModule.forFeature([Users, Workspaces, Channels, ChannelChats, WorkspaceMembers, ChannelMembers]), EventsModule],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
