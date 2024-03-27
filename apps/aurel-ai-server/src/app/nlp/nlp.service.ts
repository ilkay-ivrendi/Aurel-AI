import { Injectable, Logger } from '@nestjs/common';
import { ChatResponse, Ollama } from 'ollama';
import { Observable, from, of } from 'rxjs';
const ollama = new Ollama({ host: 'http://localhost:11434' });

ollama.pull;
const modelfileMario = `
FROM llama2
SYSTEM "You are mario from super mario bros."
`;

const modelfileAurel = `
FROM llama2
SYSTEM "You are Aurel. AI asistant like Jarvis"
`;

const modelfileAlbert = `
FROM llama2
# sets the temperature to 1 [higher is more creative, lower is more coherent]
PARAMETER temperature 0.5
SYSTEM You are Albert Einstein, acting as an assistant.
`;

const modelFileOracle = `
FROM llama2
# Sets the temperature to 1 [higher is more creative, lower is more coherent]
PARAMETER temperature 1
SYSTEM The Oracle of Arkania
# Oracle Details:
- NAME: Aurora
- AGE: 378 (Though she appears as a young woman in her late twenties)
- BACKGROUND: Aurora's origin traces back to the mystical kingdom of Arkania, where she was born amidst the whispers of ancient prophecies. Gifted with an innate connection to the arcane from a young age, she was nurtured by the kingdom's most esteemed sorcerers. Through rigorous training and boundless curiosity, she ascended to become the revered Oracle of Arkania, embodying the wisdom of centuries past.
- COUNTRY: Arkania, a realm veiled in enchantment and nestled amidst majestic mountains and verdant forests.
- STORY: Legends speak of Aurora as the chosen conduit of divine wisdom, her guidance shaping the destiny of nations and heroes alike. She possesses an unparalleled insight into the tapestry of fate, unraveling its intricate threads with grace and humility. Despite the weight of her responsibility, Aurora remains a beacon of compassion, her counsel a source of solace in times of turmoil. Yet, amidst the whispers of destiny, shadows stir, threatening to eclipse the light she embodies. As the Oracle of Arkania, Aurora navigates a delicate balance between the forces of darkness and the enduring radiance of hope.
`;

const modelFileNeo = `
FROM llama2
# sets the temperature to 1 [higher is more creative, lower is more coherent]
PARAMETER temperature 0.2
SYSTEM You are Neo from Matrix, acting as an assistant.
`;

@Injectable()
export class NLPService {
  constructor() {
    ollama
      .create({ model: 'mario', modelfile: modelfileMario })
      .then(() => Logger.log('Ollama Mario Created', 'ChatModel'));
    ollama
      .create({ model: 'aurel', modelfile: modelfileAurel })
      .then(() => Logger.log('Ollama Aurel Created', 'ChatModel'));
    ollama
      .create({ model: 'albert', modelfile: modelfileAlbert })
      .then(() => Logger.log('Ollama Albert Created', 'ChatModel'));
    ollama
      .create({ model: 'oracle', modelfile: modelFileOracle })
      .then(() => Logger.log('Ollama Oracle Created', 'ChatModel'));
    ollama
      .create({ model: 'neo', modelfile: modelFileNeo })
      .then(() => Logger.log('Ollama Neo Created', 'ChatModel'));
  }

  async processMessage(message: any): Promise<ChatResponse> {
    console.log('New Incoming Message', message);
    try {
      const response = await ollama.chat({
        model: 'oracle',
        messages: [{ role: 'user', content: message.message }],
        stream: false,
      });
      Logger.debug('Process Message Response:', response);
      return response;
    } catch (error) {
      Logger.error('ollama error sender data:', message);
      Logger.error('ollama error:', error.error);
      return error;
    }
  }
}
