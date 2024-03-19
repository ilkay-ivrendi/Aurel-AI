import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ChatService } from './chat.service';

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
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    FlexLayoutModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private chatService = inject(ChatService)
  messages: Message[] = [
    {
      sender: 'System',
      content: 'Hello There! How Can I Help You?',
      timestamp: new Date(),
    },
  ];
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
      this.chatService.sendMessage(message.content).subscribe((data:any) => {
        console.log(data);
        const system_message: Message = {
          sender: 'System',
          content: data.message,
          timestamp: new Date(),
        };
        this.messages.push(system_message);
      });
    }
  }
}
