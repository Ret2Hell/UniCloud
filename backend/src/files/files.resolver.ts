import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FilesService } from './files.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { File } from './entities/file.entity';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
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
    const { createReadStream, filename, mimetype } = file;

    if (mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }

    const uniqueName = `${Date.now()}-${filename}`;
    const storagePath = `uploads/${uniqueName}`;

    const stream = createReadStream();
    const writeStream = fs.createWriteStream(storagePath);

    await new Promise((resolve, reject) => {
      stream.pipe(writeStream);
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    return this.filesService.create(id, {
      name: filename,
      size: fs.statSync(storagePath).size,
      path: storagePath,
      folderId,
    });
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
    const file = await this.filesService.findOne(fileId);

    if (!file) {
      throw new BadRequestException('File not found');
    }

    if (file.ownerId !== userId) {
      throw new BadRequestException(
        'You are not authorized to delete this file',
      );
    }

    fs.unlinkSync(file.path);
    return this.filesService.delete(fileId);
  }
}
