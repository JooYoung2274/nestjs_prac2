import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { query } from 'express';

@ApiTags('Channels')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  @Get()
  getAllChannels() {}

  @Get(':name')
  getSpecificChannel() {}

  @Post()
  createChannel() {}

  @Get(':name/chats')
  getChat() {}

  @Post(':name/chats')
  postChat() {}

  @Get(':name/chats')
  getUnreadChats() {}

  @Post(':name/images')
  getImage() {}

  @Get(':name/members')
  getAllMembers() {}

  @Post(':name/members')
  inviteMembers() {}
}
