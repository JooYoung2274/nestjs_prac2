import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { query } from "express";
import { ChannelsService } from "./channels.service";

@ApiTags("Channels")
@Controller("api/workspaces/:url/channels")
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}
  @ApiParam({
    name: "url",
    description: "워크스페이스 url",
    required: true,
  })
  @ApiOperation({ summary: "모든 채널 조회" })
  @Get()
  getAllChannels() {}

  @ApiParam({
    name: "url",
    description: "워크스페이스 url",
    required: true,
  })
  @ApiParam({
    name: "name",
    description: "채널 이름",
    required: true,
  })
  @ApiOperation({ summary: "특정 채널 조회" })
  @Get(":name")
  getSpecificChannel(@Param("name") name: string) {
    const result = this.channelsService.getWorkspaceChannel(name);
    return result;
  }

  @ApiParam({
    name: "url",
    description: "워크스페이스 url",
    required: true,
  })
  @ApiOperation({ summary: "채널 생성" })
  @Post()
  createChannel() {}

  @ApiParam({
    name: "url",
    description: "워크스페이스 url",
    required: true,
  })
  @ApiParam({
    name: "name",
    description: "채널 이름",
    required: true,
  })
  @ApiOperation({ summary: "채팅 조회" })
  @Get(":name/chats")
  getChat() {}

  @ApiParam({
    name: "url",
    description: "워크스페이스 url",
    required: true,
  })
  @ApiParam({
    name: "name",
    description: "채널 이름",
    required: true,
  })
  @ApiOperation({ summary: "채팅 보내기" })
  @Post(":name/chats")
  postChat() {}

  @ApiParam({
    name: "url",
    description: "워크스페이스 url",
    required: true,
  })
  @ApiParam({
    name: "name",
    description: "채널 이름",
    required: true,
  })
  @ApiOperation({ summary: "읽지않은 채팅 조회" })
  @Get(":name/chats")
  getUnreadChats() {}

  @ApiParam({
    name: "url",
    description: "워크스페이스 url",
    required: true,
  })
  @ApiParam({
    name: "name",
    description: "채널 이름",
    required: true,
  })
  @ApiOperation({ summary: "이미지 조회" })
  @Post(":name/images")
  getImage() {}

  @ApiParam({
    name: "url",
    description: "워크스페이스 url",
    required: true,
  })
  @ApiParam({
    name: "name",
    description: "채널 이름",
    required: true,
  })
  @ApiOperation({ summary: "모든 멤버 조회" })
  @Get(":name/members")
  getAllMembers() {}

  @ApiParam({
    name: "url",
    description: "워크스페이스 url",
    required: true,
  })
  @ApiParam({
    name: "name",
    description: "채널 이름",
    required: true,
  })
  @ApiOperation({ summary: "멤버 초대하기" })
  @Post(":name/members")
  inviteMembers() {}
}
