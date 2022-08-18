import { Injectable, NotFoundException } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { InjectRepository } from "@nestjs/typeorm";
import { chmod } from "fs";
import { ChannelChats } from "src/entities/ChannelChats";
import { ChannelMembers } from "src/entities/ChannelMembers";
import { Channels } from "src/entities/Channels";
import { Users } from "src/entities/Users";
import { Workspaces } from "src/entities/Workspaces";
import { Connection, MoreThan, Repository } from "typeorm";

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(ChannelChats) private channelChatsRepository: Repository<ChannelChats>,
    @InjectRepository(Workspaces) private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(ChannelMembers) private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Channels) private channelsRepository: Repository<Channels>,
    private connection: Connection,
  ) {}

  async findById(id: number) {
    const result = this.channelsRepository.findOne({ where: { id } });
    return result;
  }

  async getWorkspaceChannels(url: string, myId: number) {
    const result = this.channelsRepository
      .createQueryBuilder("c")
      .innerJoinAndSelect("c.ChannelMembers", "cm", "cm.userId = :myId", { myId: myId })
      .innerJoinAndSelect("c.Workspace", "w", "w.url = :url", { url: url })
      .getMany();
    return result;
  }

  async getWorkspaceChannel(name: string) {
    const result = this.channelsRepository.findOne({ where: { name: name }, relations: ["Workspace"] }); // relations: ["Workspace"] 붙이면 워크스페이스도 같이 가져와짐
    return result;
  }

  async createWorkspaceChannels(url: string, name: string, myId: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const workspace = await this.workspacesRepository.findOne({ where: { url: url } });

    if (!workspace) {
      return null;
    }

    try {
      const channel = this.channelsRepository.create();
      channel.name = name;
      channel.WorkspaceId = workspace.id;
      const channelReturned = await this.channelsRepository.save(channel);

      const channelMember = this.channelMembersRepository.create();
      channelMember.ChannelId = channelReturned.id;
      channelMember.UserId = myId;
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

  async getWorkspaceChannelMembers(url: string, name: string) {
    const result = await this.usersRepository
      .createQueryBuilder("u")
      .innerJoin("u.Channels", "c", "c.name = :name", { name: name })
      .innerJoin("c.Workspace", "w", "w.url = :url", { url: url })
      .getMany();
    return result;
  }

  async createWorkspaceChannelMembers(url: string, name: string, email: string) {
    const channel = await this.channelsRepository
      .createQueryBuilder("c")
      .innerJoin("c.Workspace", "w", "w.url = :url", { url: url })
      .where("c.name = :name", { name: name })
      .getOne();

    if (!channel) {
      throw new NotFoundException("channel X");
    }

    const user = await this.usersRepository
      .createQueryBuilder("u")
      .where("u.email = :email", { email: email })
      .innerJoin("u.Workspaces", "w", "w.url = :url", { url: url })
      .getOne();

    if (!user) {
      throw new NotFoundException("user X");
    }

    const channelMember = this.channelMembersRepository.create();
    channelMember.ChannelId = channel.id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);

    return;
  }

  async getWorkspaceChannelChats(url: string, name: string, perPage: number, page: number) {
    const result = await this.channelChatsRepository
      .createQueryBuilder("cc")
      .innerJoin("cc.Channel", "c", "c.name = :name", { name: name }) //innerJoin은 단순 where용으로 타고타고 들어갈때 사용
      .innerJoin("c.Workspace", "w", "w.url = :url", { url: url })
      .innerJoinAndSelect("cc.User", "u") // innerJoinAndSelect는 cc에 대한 정보와 u에 대한 정보 둘다 가져옴
      .orderBy("cc.createdAt", "DESC") // 정렬
      .take(perPage) // limit과 동일 (한페이지에 perPage만큼 (example : 20) 가져오겠다)
      .skip(perPage * (page - 1)) // 처음왔을대 1페이지면 0개 skip, 2페이지면 20개 skip ....... 10페이지면 180개 skip하고 넘겨줌
      .getMany();
    return result;
  }

  async getChannelUnreadsCount(url: string, name: string, after: string) {
    const channel = await this.channelsRepository
      .createQueryBuilder("c")
      .innerJoin("c.Workspace", "w", "w.url = :url", { url: url })
      .where("c.name = :name", { name: name })
      .getOne();

    const result = await this.channelChatsRepository.count({
      where: {
        ChannelId: channel.id,
        createdAt: MoreThan(new Date(after)),
      },
    });
    return result;
  }
}
