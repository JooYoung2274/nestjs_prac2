import { Body, Controller, Get, Param, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { User } from "src/common/decorators/user.decorator";
import { ChannelsService } from "./channels.service";
import { PostChatDto } from "./dto/post-chat.dto";
import fs from "fs";
import multer from "multer";
import path from "path";

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

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
  postChat(@Body() body: PostChatDto, @User() user, @Param("url") url: string, @Param("name") name: string) {
    const result = this.channelsService.postChat({ url, name, content: body.content, myId: user.id });
    return result;
  }

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
  @ApiOperation({ summary: "이미지 보내기" })
  @UseInterceptors(
    FilesInterceptor("image", 10, {
      storage: multer.diskStorage({
        destination(req, file, cb) {
          cb(null, "uploads/");
        },
        filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  ) //한개 올리는거면 FileInterceptor -> @UploadedFile() | 두개 올리는거면 FilesInterceptor -> @UploadedFiles()
  @Post(":name/images")
  postImage(@UploadedFiles() files: Express.Multer.File[], @Param("url") url: string, @Param("name") name: string, @User() user) {
    const result = this.channelsService.createWorkspaceChannelImages(url, name, files, user.id);
    return result;
  }

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
