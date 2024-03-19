import { Injectable } from '@nestjs/common';

@Injectable()
export class NLPService {

  processMessage(message: string): string {
    // Logic to process message with NLP model
    return 'Processed message';
  }
  
}