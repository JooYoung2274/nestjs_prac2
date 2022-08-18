import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Connection, getConnection } from "typeorm";
import { ChannelMembers } from "../entities/ChannelMembers";

import { Users } from "../entities/Users";
import { WorkspaceMembers } from "../entities/WorkspaceMembers";

import { UsersService } from "./users.service";

class MockUserRepository {
  #data = [{ email: "joo@joo.com", id: 1 }];
  findOne({ where: { email } }) {
    const data = this.#data.find(v => v.email === email);
    if (data) {
      return data;
    }
    return null;
  }
}
class MockWorkspaceMemberRepository {}
class MockChannelMembersRepository {}

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: MockUserRepository,
        },
        {
          provide: getRepositoryToken(WorkspaceMembers),
          useClass: MockWorkspaceMemberRepository,
        },
        {
          provide: getRepositoryToken(ChannelMembers),
          useClass: MockChannelMembersRepository,
        },
        { provide: Connection, useClass: class MockConnection {} },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("findByEmail은 이메일을 통해 유저를 찾아야 함", () => {
    expect(service.findByEmail("joo@joo.com")).resolves.toStrictEqual({ email: "joo@joo.com", id: 1 });
  });
});
