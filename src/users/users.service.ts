import { BadRequestException, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/entities/Users";
import { Connection, QueryResult, Repository } from "typeorm";
import { JoinRequestDto } from "./dto/join.request.dto";
import bcrypt from "bcrypt";
import { WorkspaceMembers } from "src/entities/WorkspaceMembers";
import { ChannelMembers } from "src/entities/ChannelMembers";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers) private workspaceMemberRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers) private channelMembersRepository: Repository<ChannelMembers>,
    private connection: Connection,
  ) {}

  async join(email: string, nickname: string, password: string) {
    // typeorm 공식문서에서 queryRunner 쓰라고 권장함
    // queryRunner사용해서 transaction 걸어줄때 this.repository로 사용하면 module에서 연결된 repository로 불러와지기 때문에 transaction이 안걸림
    // 그래서 this.repository -> queryRunner.manager.getRepository(Entity) 이렇게 바꿔줘야함
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // class-validator로 dto 단에서 검증 가능
    // if (!email) {
    //   throw new BadRequestException('email X');
    // }
    // if (!nickname) {
    //   throw new BadRequestException('nickname X');
    // }
    // if (!password) {
    //   throw new BadRequestException('password X'); //status 400 error
    // }

    const user = await queryRunner.manager.getRepository(Users).findOne({ where: { email } });
    if (user) {
      throw new UnauthorizedException("USER_EXISTS"); //status 401 error
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // const returned = await this.usersRepository.save({
    //   email,
    //   nickname,
    //   password: hashedPassword,
    // });

    // await this.workspaceMemberRepository.save({
    //   UserId: returned.id,
    //   WorkspaceId: 1,
    // });

    // await this.channelMembersRepository.save({
    //   UserId: returned.id,
    //   ChannelId: 1,
    // });

    // 위처럼 할수도 있지만 아래처럼 할수도있음.
    // const newUser = new Users();
    try {
      const newUser = queryRunner.manager.getRepository(Users).create();
      newUser.email = email;
      newUser.nickname = nickname;
      newUser.password = hashedPassword;
      const returned = await queryRunner.manager.getRepository(Users).save(newUser);

      // const workspaceMember = new WorkspaceMembers();
      const workspaceMember = queryRunner.manager.getRepository(WorkspaceMembers).create();
      workspaceMember.UserId = returned.id;
      workspaceMember.WorkspaceId = 1;
      await queryRunner.manager.getRepository(WorkspaceMembers).save(workspaceMember);

      // const channelMember = new ChannelMembers();
      const channelMember = queryRunner.manager.getRepository(ChannelMembers).create();
      channelMember.UserId = returned.id;
      channelMember.ChannelId = 1;
      await queryRunner.manager.getRepository(ChannelMembers).save(channelMember);

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

  async findOne(email: string) {
    return;
  }

  async create(newUser: JoinRequestDto) {}
}
