import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class File {
  @Field(() => ID)
  id: string;

  name: string;

  size: number;

  path: string;

  @Field(() => String, { nullable: true })
  content?: string;

  ownerId: string;

  parentId?: string | null;

  createdAt: Date;

  updatedAt: Date;
}
