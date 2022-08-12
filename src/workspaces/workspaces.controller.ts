import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('workspaces')
@Controller('api/workspaces')
export class WorkspacesController {
  @ApiOperation({ summary: '내 워크스페이스 가져오기' })
  @Get()
  getMyWorkspaces() {}

  @ApiOperation({ summary: '내 워크스페이스 만들기' })
  @Post()
  createMyWorkspace() {}

  @ApiParam({
    name: 'url',
    description: '워크스페이스 url',
    required: true,
  })
  @ApiOperation({ summary: '워크스페이스 모든 멤버 조회' })
  @Get(':url/members')
  getAllMembersFromWorkspace() {}

  @ApiParam({
    name: 'url',
    description: '워크스페이스 url',
    required: true,
  })
  @ApiOperation({ summary: '워크스페이스 멤버 초대하기' })
  @Post(':url/members')
  inviteMembersToWorkspace() {}

  @ApiParam({
    name: 'url',
    description: '워크스페이스 url',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: '사용자 id',
    required: true,
  })
  @ApiOperation({ summary: '워크스페이스 멤버 삭제하기' })
  @Delete(':url/members/:id')
  kickMemberFromWorkspace() {}

  @ApiParam({
    name: 'url',
    description: '워크스페이스 url',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: '사용자 id',
    required: true,
  })
  @ApiOperation({ summary: '워크스페이스 멤버 정보 조회' })
  @Get(':url/members/:id')
  getMemberInfoInWorkspace() {}
}
