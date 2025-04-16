import {
  Controller,
  Param,
  Res,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';
import * as path from 'path';
import * as fs from 'fs';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('download/:id')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.filesService.findOne(id);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const absolutePath = path.resolve(file.path);

    if (!fs.existsSync(absolutePath)) {
      throw new NotFoundException('File not found on disk');
    }

    res.download(absolutePath, file.name, (err) => {
      if (err) {
        res.status(500).send('Could not download the file');
      }
    });
  }
}
