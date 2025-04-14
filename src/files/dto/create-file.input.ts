import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateFileInput {
  name: string;

  size: number;

  path: string;

  folderId: string;
}
