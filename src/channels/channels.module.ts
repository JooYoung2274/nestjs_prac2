import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelMembers } from "src/entities/ChannelMembers";
import { Channels } from "src/entities/Channels";
import { Users } from "src/entities/Users";
import { WorkspaceMembers } from "src/entities/WorkspaceMembers";
import { Workspaces } from "src/entities/Workspaces";
import { ChannelsController } from "./channels.controller";
import { ChannelsService } from "./channels.service";

@Module({
  imports: [TypeOrmModule.forFeature([Users, Workspaces, Channels, WorkspaceMembers, ChannelMembers])],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
