import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderInput } from './dto/create-folder.input';
import * as fs from 'fs';

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

  async delete(folderId: string, userId: string): Promise<boolean> {
    const folder = await this.prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        files: true,
        children: true,
      },
    });

    if (!folder) {
      throw new BadRequestException('Folder not found');
    }

    if (folder.ownerId !== userId) {
      throw new BadRequestException(
        'You are not authorized to delete this folder',
      );
    }

    // Delete files in the folder
    for (const file of folder.files) {
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.warn(`Failed to delete file at ${file.path}`, err);
      }

      await this.prisma.file.delete({
        where: { id: file.id },
      });
    }

    // Recursively delete child folders
    for (const child of folder.children) {
      await this.delete(child.id, userId);
    }

    // Finally, delete the folder
    await this.prisma.folder.delete({
      where: { id: folderId },
    });

    return true;
  }
}
