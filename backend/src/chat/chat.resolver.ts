import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { ChatMessage } from './entities/chat.entity';
import { FilesService } from '../files/files.service';

@Resolver(() => ChatMessage)
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    private readonly FilesService: FilesService,
  ) {}

  @Mutation(() => ChatMessage)
  async sendMessage(
    @Args('content') content: string,
    @Args('fileId') fileId: string,
  ) {
    const userMessage = {
      role: 'user' as 'user' | 'assistant',
      content,
    };

    // Get file content if provided
    let fileContent = '';
    if (fileId) {
      const file = await this.FilesService.findOne(fileId);
      fileContent = file?.content || '';
    }

    // Get AI response
    const aiResponse =
      (await this.chatService.getChatResponse(userMessage, fileContent)) ||
      'Sorry, I could not understand your request.';

    const assistantMessage = {
      role: 'assistant',
      content: aiResponse,
    };

    return assistantMessage;
  }
}
