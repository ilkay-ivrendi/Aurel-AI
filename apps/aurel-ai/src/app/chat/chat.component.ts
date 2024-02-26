import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

export interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'aurel-ai-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    FlexLayoutModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  messages: Message[] = [ {
    sender: 'System',
    content: "Hello There! How Can I Help You?",
    timestamp: new Date(),
  }];
  newMessage: string = '';
  

  sendMessage(): void {
    if (this.newMessage.trim() !== '') {
      const message: Message = {
        sender: 'Me',
        content: this.newMessage,
        timestamp: new Date(),
      };
      this.messages.push(message);
      this.newMessage = '';
    }
  }
}
