import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ChannelChats } from "./ChannelChats";
import { ChannelMembers } from "./ChannelMembers";
import { Channels } from "./Channels";
import { DMs } from "./DMs";
import { Mentions } from "./Mentions";
import { WorkspaceMembers } from "./WorkspaceMembers";
import { Workspaces } from "./Workspaces";

@Index("email", ["email"], { unique: true })
@Entity({ schema: "sleact", name: "users" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @ApiProperty({
    example: "joo@gamil.com",
    description: "이메일",
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @Column("varchar", { name: "email", unique: true, length: 30 })
  email: string;

  @ApiProperty({
    example: "joo",
    description: "닉네임",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Column("varchar", { name: "nickname", length: 30 })
  nickname: string;

  @ApiProperty({
    example: "asdfsad33333",
    description: "비밀번호",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Column("varchar", { name: "password", length: 100, select: false }) // select : false 패스워드 빼고 불러오기
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Soft Delete. (사용자가 삭제해도 실제로 지우지않음.)
  // 실제로 아예 삭제해도 되는 데이터가 아닌 복구할수도 있는 데이터라면
  // deletedAt 의 null 값 유무에 따라서 정함.
  // 이러면 데이터 불러올 때 deleteAt이 null이 아닌 조건이 필요함.
  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => ChannelChats, channelchats => channelchats.User)
  ChannelChats: ChannelChats[];

  @OneToMany(() => ChannelMembers, channelmembers => channelmembers.User)
  ChannelMembers: ChannelMembers[];

  @OneToMany(() => DMs, dms => dms.Sender)
  DMs: DMs[];

  @OneToMany(() => DMs, dms => dms.Receiver)
  DMs2: DMs[];

  @OneToMany(() => Mentions, mentions => mentions.Sender)
  Mentions: Mentions[];

  @OneToMany(() => Mentions, mentions => mentions.Receiver)
  Mentions2: Mentions[];

  @OneToMany(() => WorkspaceMembers, workspacemembers => workspacemembers.User)
  WorkspaceMembers: WorkspaceMembers[];

  @OneToMany(() => Workspaces, workspaces => workspaces.Owner)
  OwnedWorkspaces: Workspaces[];

  @ManyToMany(() => Workspaces, workspaces => workspaces.Members)
  @JoinTable({
    // ManyToMany
    // @joinTable 지정할 때 현재 Users class 니까 joinColumn에 UserId 넣고,
    // 밑에 Workspaces있느니까 inversJoinColumn에 WorkspaceId 넣으면 됨. 그냥 외우는게 좋음
    name: "workspacemembers",
    joinColumn: {
      name: "UserId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "WorkspaceId",
      referencedColumnName: "id",
    },
  })
  Workspaces: Workspaces[];

  // ManyToMany
  // @joinTable 지정할 때 현재 Users class 니까 joinColumn에 UserId 넣고,
  // 밑에 ChannelId있느니까 inversJoinColumn에 ChannelId 넣으면 됨. 그냥 외우는게 좋음
  @ManyToMany(() => Channels, channels => channels.Members)
  @JoinTable({
    name: "channelmembers",
    joinColumn: {
      name: "UserId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "ChannelId",
      referencedColumnName: "id",
    },
  })
  Channels: Channels[];
}
