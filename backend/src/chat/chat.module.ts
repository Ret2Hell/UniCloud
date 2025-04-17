import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { FilesService } from 'src/files/files.service';

@Module({
  providers: [ChatResolver, ChatService, FilesService],
})
export class ChatModule {}
