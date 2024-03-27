import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ChatService } from './chat.service';
import { CredentialsService } from 'libs/auth/src/lib/credentials.service';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
export interface Message {
  sender: string;
  role: string;
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
    MatProgressSpinnerModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private chatService = inject(ChatService);
  private credentialsService = inject(CredentialsService);
  private user_data = this.credentialsService.credentials?.user_data;
  messageLoaded = signal(true);

  messages: Message[] = [
    {
      sender: 'System',
      role: 'assistant',
      content: 'Hello There! How Can I Help You?',
      timestamp: new Date(),
    },
  ];
  newMessage: string = '';

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    let voices = this.chatService.getVoices().subscribe((data) => {
      const myData = data;
      const filter = myData.filter((data: any) => data.language === 'en_US');
      console.log(filter);
    });
    console.log('Voices', voices);

    // this.chatService.speakMessage('Hello World Aurel').subscribe((data) => {
    //   this.playSound(data);
    //   console.log('Data Audio', data);
    // });
  }

  sendMessage(): void {
    if (this.newMessage.trim() !== '') {
      const message: Message = {
        sender: this.user_data.username,
        role: 'user',
        content: this.newMessage,
        timestamp: new Date(),
      };
      this.messages.push(message);
      console.log('message.contet: ', message.content);
      this.newMessage = '';
      this.messageLoaded.set(false);

      this.chatService.sendMessage(message.content).subscribe({
        next: (response) => {
          console.log('Received part:', response.data);
          const message = response.data.message;
          const system_message: Message = {
            sender: response.data.model,
            role: message.role,
            content: message.content,
            timestamp: message.created_at,
          };
          // let utterance = new SpeechSynthesisUtterance(message.content);
          // let voices = speechSynthesis.getVoices();
          // (utterance.lang = 'en-US'), (utterance.voice = voices[2]);
          // console.log(voices);
          // speechSynthesis.speak(utterance);
          this.chatService.speakMessage(message.content).subscribe((data) => {
            this.playSound(data);
            console.log('Data Audio', data);
          });
          this.messages.push(system_message);
        },
        error: (err) => console.error('Observable emitted an error: ', err),
        complete: () => {
          console.log('Observable emitted the complete notification'),
            this.messageLoaded.set(true);
        },
      });
    }
  }

  playSound(blob: Blob) {
    const audio = new Audio();
    audio.src = URL.createObjectURL(blob);
    audio.muted = false;
    console.log(
      'Play Sound:',
      audio,
      audio.controls,
      audio.autoplay,
      audio.muted
    );
    audio.play();
  }
}
