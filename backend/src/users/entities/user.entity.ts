import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  username: string;

  email: string;

  password: string;

  access_token?: string | null;

  createdAt: Date;

  updatedAt: Date;
}
