import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { User } from "src/common/decorators/user.decorator";
import { Users } from "src/entities/Users";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { WorkspacesService } from "./workspaces.service";

@ApiTags("workspaces")
@Controller("api/workspaces")
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  // @ApiOperation({ summary: "내 워크스페이스 가져오기" })
  // @Get()
  // getMyWorkspaces(@Param("myId", ParseIntPipe) myId: number) {
  //   // const result = this.workspacesService.findMyWorkspaces(+myId); // + 붙여주는 것도 방법이지만...
  //   // ParseIntPipe 넣어주면 애초에 불러오면서 number로 타입변환해줌

  //   // 만약 /api/workspaces/1,2,3 or /api/workspaces?id=1,2,3 이런식으로 오면
  //   // new ParseArrayPipe({items: Number, separator: ','}) 활용해서 배열타입으로 변환하는 꿀팁
  //   const result = this.workspacesService.findMyWorkspaces(myId);
  //   return result;
  // }

  @ApiOperation({ summary: "내 워크스페이스 가져오기" })
  @Get()
  getMyWorkspaces(@User() user: Users) {
    const result = this.workspacesService.findMyWorkspaces(user.id);
    return result;
  }

  @ApiOperation({ summary: "내 워크스페이스 만들기" })
  @Post()
  createMyWorkspace(@User() user: Users, @Body() body: CreateWorkspaceDto) {
    const result = this.workspacesService.createWorkspace(body.workspace, body.url, user.id);
    return result;
  }

  @ApiParam({
    name: "url",
    description: "워크스페이스 url",
    required: true,
  })
  @ApiOperation({ summary: "워크스페이스 모든 멤버 조회" })
  @Get(":url/members")
  getAllMembersFromWorkspace() {}

  @ApiParam({
    name: "url",
    description: "워크스페이스 url",
    required: true,
  })
  @ApiOperation({ summary: "워크스페이스 멤버 초대하기" })
  @Post(":url/members")
  inviteMembersToWorkspace() {}

  @ApiParam({
    name: "url",
    description: "워크스페이스 url",
    required: true,
  })
  @ApiParam({
    name: "id",
    description: "사용자 id",
    required: true,
  })
  @ApiOperation({ summary: "워크스페이스 멤버 삭제하기" })
  @Delete(":url/members/:id")
  kickMemberFromWorkspace() {}

  @ApiParam({
    name: "url",
    description: "워크스페이스 url",
    required: true,
  })
  @ApiParam({
    name: "id",
    description: "사용자 id",
    required: true,
  })
  @ApiOperation({ summary: "워크스페이스 멤버 정보 조회" })
  @Get(":url/members/:id")
  getMemberInfoInWorkspace() {}
}
