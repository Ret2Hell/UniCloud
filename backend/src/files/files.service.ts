import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFileInput } from './dto/create-file.input';

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, input: CreateFileInput) {
    const newFile = await this.prisma.folder.update({
      where: { id: input.folderId },
      data: {
        files: {
          create: {
            name: input.name,
            size: input.size,
            path: input.path,
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

  async delete(id: string): Promise<boolean> {
    const file = await this.findOne(id);

    if (!file) {
      throw new Error(`File with ID ${id} not found`);
    }

    await this.prisma.file.delete({
      where: { id },
    });

    return true;
  }
}
