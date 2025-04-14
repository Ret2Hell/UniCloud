import { CreateFolderInput } from './create-folder.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFolderInput extends PartialType(CreateFolderInput) {
  @Field(() => Int)
  id: number;
}
