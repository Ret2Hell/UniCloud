import { ObjectType, Field, ID } from '@nestjs/graphql';
import { File } from '../../files/entities/file.entity';

@ObjectType()
export class Folder {
  @Field(() => ID)
  id: string;

  name: string;

  @Field(() => Folder, { nullable: true })
  parent?: Folder;

  @Field(() => [Folder])
  children: Folder[];

  @Field(() => [File])
  files: File[];

  createdAt: Date;

  updatedAt: Date;
}
