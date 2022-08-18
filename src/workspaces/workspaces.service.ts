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
    // typeorm innerJoin은 join한 table의 데이터는 안가져옴
    // 만약 가져오게 하고 싶으면 innerJoinAndSelect 사용하면됨
    const result = this.usersRepository
      .createQueryBuilder("u")
      .innerJoin("user.WorkspaceMembers", "wm")
      .innerJoin("wm.Workspaces", "w", "w.url = :url", { url: url })
      .getMany();
    return result;
  }

  async createWorkspaceMembers(url: string, email: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const workspace = await this.workspacesRepository.createQueryBuilder("w").innerJoinAndSelect("w.Channels", "c").getOne();
    const user = await this.usersRepository.findOne({ where: { email: email } });

    if (!user) {
      return null;
    }
    try {
      const workspaceMember = this.workspaceMembersRepository.create();
      workspaceMember.WorkspaceId = workspace.id;
      workspaceMember.UserId = user.id;
      await this.workspaceMembersRepository.save(workspaceMember);

      const channelMember = this.channelMembersRepository.create();
      channelMember.UserId = user.id;
      channelMember.ChannelId = workspace.Channels.find(v => {
        v.name === "first";
      }).id;
      await this.channelMembersRepository.save(channelMember);

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getWorkspaceMember(url: string, id: number) {
    // typeorm innerJoin은 join한 table의 데이터는 안가져옴
    // 만약 가져오게 하고 싶으면 innerJoinAndSelect 사용하면됨
    const result = this.usersRepository
      .createQueryBuilder("u")
      .where("u.id = :id", { id: id })
      //   .andWhere("u.name = :name", { name: name }) // where 조건 여러개 걸때 보통 andWhere() 사용
      .innerJoin("user.WorkspaceMembers", "wm")
      .innerJoin("wm.Workspaces", "w", "w.url = :url", { url: url })
      .getOne();
    return result;
  }
}
