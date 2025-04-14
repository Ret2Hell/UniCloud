import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFileInput } from './dto/create-file.input';

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, input: CreateFileInput) {
    return await this.prisma.file.create({
      data: {
        ...input,
        ownerId: userId,
      },
    });
  }

  async findByFolder(folderId: string) {
    return await this.prisma.file.findMany({
      where: { folderId },
    });
  }
}
