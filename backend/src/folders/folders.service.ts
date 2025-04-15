import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderInput } from './dto/create-folder.input';

@Injectable()
export class FoldersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(id: string, input: CreateFolderInput) {
    return await this.prisma.folder.create({
      data: {
        name: input.name,
        parentId: input.parentId,
        ownerId: id,
      },
    });
  }

  async findById(id: string) {
    const folder = await this.prisma.folder.findUnique({
      where: { id },
      include: {
        children: true,
        files: true,
        parent: true,
      },
    });

    if (!folder) {
      throw new NotFoundException(`Folder with id ${id} not found`);
    }
    return folder;
  }

  async findRootFolders(userId: string) {
    return await this.prisma.folder.findMany({
      where: {
        ownerId: userId,
        parentId: null,
      },
    });
  }
}
