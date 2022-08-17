import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelMembers } from "src/entities/ChannelMembers";
import { Channels } from "src/entities/Channels";
import { Users } from "src/entities/Users";
import { WorkspaceMembers } from "src/entities/WorkspaceMembers";
import { Workspaces } from "src/entities/Workspaces";
import { Connection, Repository } from "typeorm";

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(ChannelMembers) private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(WorkspaceMembers) private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(Channels) private channelsRepository: Repository<Channels>,
    @InjectRepository(Workspaces) private workspacesRepository: Repository<Workspaces>,
    private connection: Connection,
  ) {}

  async findById(id: number) {
    const result = this.workspacesRepository.findByIds([id]);
    return result;
  }

  async findMyWorkspaces(myId: number) {
    const result = await this.workspacesRepository.find({
      where: {
        WorkspaceMembers: [{ UserId: myId }],
      },
    });
    return result;
  }

  async createWorkspace(name: string, url: string, myId: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const workspace = this.workspacesRepository.create();
      workspace.name = name;
      workspace.url = url;
      workspace.OwnerId = myId;

      const returned = await this.workspacesRepository.save(workspace);

      const workspaceMember = this.workspaceMembersRepository.create();
      workspaceMember.UserId = myId;
      workspaceMember.WorkspaceId = returned.id;

      const channels = this.channelsRepository.create();
      channels.name = "first";
      channels.WorkspaceId = returned.id;

      const [, channelReturned] = await Promise.all([
        this.workspaceMembersRepository.save(workspaceMember),
        this.channelsRepository.save(channels),
      ]);

      const channelMember = this.channelMembersRepository.create();
      channelMember.UserId = myId;
      channelMember.ChannelId = channelReturned.id;
      await this.channelMembersRepository.save(channelMember);

      await queryRunner.commitTransaction();
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getWorkspaceMembers(url: string) {
    const result = this.usersRepository
      .createQueryBuilder("u")
      .innerJoin("user.WorkspaceMembers", "wm")
      .innerJoin("wm.Workspaces", "w", "w.url = :url", { url: url })
      .getMany();
    return result;
  }
}
