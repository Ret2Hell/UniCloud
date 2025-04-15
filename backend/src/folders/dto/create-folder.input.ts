import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateFolderInput {
  @IsString()
  name: string;

  @IsOptional()
  @Field(() => ID, { nullable: true })
  parentId?: string | null;
}
