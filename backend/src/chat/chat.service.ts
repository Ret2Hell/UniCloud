// chat.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { AzureOpenAI } from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
  private readonly client: AzureOpenAI;
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly config: ConfigService) {
    const endpoint = this.config.get<string>('AZURE_OPENAI_ENDPOINT');
    const apiKey = this.config.get<string>('AZURE_OPENAI_KEY');
    const apiVersion = this.config.get<string>('AZURE_OPENAI_API_VERSION');
    const deployment = this.config.get<string>('AZURE_OPENAI_DEPLOYMENT_NAME');
    const options = { endpoint, apiKey, deployment, apiVersion };
    this.client = new AzureOpenAI(options);
  }

  async getChatResponse(
    message: { role: 'user' | 'assistant'; content: string },
    fileContent?: string,
  ) {
    try {
      const modelName = 'gpt-4o-mini';
      const context = fileContent ? `Document context: ${fileContent}\n\n` : '';

      const response = await this.client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `${context} You are a helpful assistant. Use the provided document context to assist the user in understanding the file.`,
          },
          message,
        ],
        max_tokens: 4096,
        temperature: 1,
        top_p: 1,
        model: modelName,
      });
      return response.choices[0].message.content;
    } catch (error) {
      this.logger.error('Azure AI Error:', error);
      throw new Error('Failed to get chat response');
    }
  }
}
