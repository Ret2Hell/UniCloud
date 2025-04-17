import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FilesService } from './files.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { File } from './entities/file.entity';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { FileUpload } from 'graphql-upload/processRequest.mjs';

@Resolver(() => File)
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @Mutation(() => File)
  async uploadPdf(
    @Args({ name: 'folderId', type: () => String }) folderId: string,
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
    @GetUser('sub') id: string,
  ) {
    return this.filesService.create(id, folderId, file);
  }

  @Query(() => [File])
  async filesInFolder(@Args('folderId') folderId: string) {
    return this.filesService.findByFolder(folderId);
  }

  @Mutation(() => Boolean)
  async deleteFile(
    @Args('fileId') fileId: string,
    @GetUser('sub') userId: string,
  ) {
    return this.filesService.delete(fileId, userId);
  }

  @Query(() => [File])
  async bookmarkedFiles(@GetUser('sub') userId: string) {
    return await this.filesService.findBookmarkedFiles(userId);
  }

  @Mutation(() => File)
  async toggleBookmark(
    @Args('fileId') fileId: string,
    @GetUser('sub') userId: string,
  ) {
    return await this.filesService.toggleBookmark(fileId, userId);
  }
}
