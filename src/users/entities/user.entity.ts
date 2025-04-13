import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  username: string;

  email: string;

  password: string;

  access_token?: string | null;
}
