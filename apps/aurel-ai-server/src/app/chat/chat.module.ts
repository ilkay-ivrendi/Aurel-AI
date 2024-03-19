import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { NLPService } from '../nlp/nlp.service';

@Module({
  controllers: [ChatController],
  providers: [NLPService],
})
export class ChatModule {}
