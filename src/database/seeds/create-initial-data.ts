import { Channels } from 'src/entities/Channels';
import { Workspaces } from 'src/entities/Workspaces';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

// database seeding
export class CreateInitialData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Workspaces)
      .values([{ id: 1, name: 'joo', url: 'joo@df.com' }]);
    await connection
      .createQueryBuilder()
      .insert()
      .into(Channels)
      .values([{ id: 1, name: 'jooChannel', WorkspaceId: 1, private: true }]);
  }
}
