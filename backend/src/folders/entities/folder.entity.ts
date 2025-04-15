import { ObjectType, Field, ID } from '@nestjs/graphql';
import { File } from '../../files/entities/file.entity';

@ObjectType()
export class Folder {
  @Field(() => ID)
  id: string;

  name: string;

  parentId: string | null;

  ownerId: string;

  @Field(() => [Folder])
  children: Folder[];

  @Field(() => [File])
  files: File[];

  createdAt: Date;

  updatedAt: Date;
}
