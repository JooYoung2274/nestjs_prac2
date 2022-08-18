import { Module } from "@nestjs/common";
import { DmsService } from "./dms.service";
import { DmsController } from "./dms.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/entities/Users";
import { Workspaces } from "src/entities/Workspaces";
import { ChannelMembers } from "src/entities/ChannelMembers";
import { WorkspaceMembers } from "src/entities/WorkspaceMembers";
import { Channels } from "src/entities/Channels";
import { EventsModule } from "src/events/events.module";
import { DMs } from "src/entities/DMs";

@Module({
  imports: [TypeOrmModule.forFeature([Users, Workspaces, Channels, WorkspaceMembers, ChannelMembers, DMs]), EventsModule],
  providers: [DmsService],
  controllers: [DmsController],
})
export class DmsModule {}
