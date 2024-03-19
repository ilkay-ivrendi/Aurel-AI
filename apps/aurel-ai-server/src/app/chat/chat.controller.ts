import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { NLPService } from '../nlp/nlp.service';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {

  constructor(private readonly nlpService: NLPService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async sendMessage(@Body() message: string) {
    // Logic to send message to NLP model
    const processedMessage = await this.nlpService.processMessage(message);
    return { message: processedMessage };
  }
}
