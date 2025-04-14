import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FilesService } from './files.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { File } from './entities/file.entity';
import { UploadPdfInput } from './dto/upload-pdf.input';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

@Resolver(() => File)
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @Mutation(() => File)
  async uploadPdf(@Args('input') input: UploadPdfInput, @GetUser() user: User) {
    const { createReadStream, filename, mimetype } = await input.file;

    if (mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }

    const uniqueName = `${Date.now()}-${filename}`;
    const storagePath = `uploads/${uniqueName}`;

    // Save locally
    const stream = createReadStream();
    const writeStream = fs.createWriteStream(storagePath);

    await new Promise((resolve, reject) => {
      stream.pipe(writeStream);
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    // Save metadata
    return this.filesService.create(user.id, {
      name: filename,
      size: fs.statSync(storagePath).size,
      path: storagePath,
      folderId: input.folderId,
    });
  }

  @Query(() => [File])
  async filesInFolder(@Args('folderId') folderId: string) {
    return this.filesService.findByFolder(folderId);
  }
}
