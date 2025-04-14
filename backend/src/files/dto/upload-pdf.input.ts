import { Field, InputType } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { FileUpload } from 'graphql-upload/processRequest.mjs';

@InputType()
export class UploadPdfInput {
  @Field(() => GraphQLUpload)
  file: Promise<FileUpload>;

  folderId: string;
}
