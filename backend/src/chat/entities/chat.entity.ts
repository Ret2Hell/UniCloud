import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ChatMessage {
  @Field(() => String)
  role: 'user' | 'assistant';

  @Field(() => String)
  content: string;
}
