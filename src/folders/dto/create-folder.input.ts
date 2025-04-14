import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateFolderInput {
  @IsString()
  name: string;

  @IsString()
  @Field(() => ID, { nullable: true })
  parentId?: string;
}
