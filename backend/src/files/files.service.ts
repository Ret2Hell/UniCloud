import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import { parsePdf } from 'src/utils/pdf.parser.utils';

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, folderId: string, file: FileUpload) {
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
      stream.on('error', (error) => {
        writeStream.close();
        reject(error);
      });
    });

    // Parse PDF content
    const extractedText: string = await parsePdf(storagePath);

    const newFile = await this.prisma.folder.update({
      where: { id: folderId },
      data: {
        files: {
          create: {
            name: filename,
            size: fs.statSync(storagePath).size,
            path: storagePath,
            content: extractedText,
            ownerId: userId,
          },
        },
      },
    });
    return newFile;
  }

  async findByFolder(folderId: string) {
    return await this.prisma.file.findMany({
      where: { folderId },
    });
  }

  async findOne(id: string) {
    return await this.prisma.file.findUnique({
      where: { id },
    });
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const file = await this.findOne(id);

    if (!file) {
      throw new BadRequestException('File not found');
    }

    if (file.ownerId !== userId) {
      throw new BadRequestException(
        'You are not authorized to delete this file',
      );
    }

    fs.unlinkSync(file.path);
    await this.prisma.file.delete({
      where: { id },
    });

    return true;
  }
}
