import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';

export interface TTSRequest {
  text: string;
  voice: string;
  noiseScale?: number;
  noiseW?: number;
  lengthScale?: number;
  ssml?: false;
  audioTarget?: 'client';
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private httpClient: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    const body = {
      message: message,
    };
    return this.httpClient.post<any>('api/chat', body);
  }

  getVoices() {
    return this.httpClient.get<any>('http://localhost:59125/api/voices');
  }

  speakMessage(message: string): Observable<Blob> {
    const headers = new HttpHeaders().set('Accept', 'audio/wav');
    const params = new HttpParams()
      .set('voice', 'en_US/vctk_low#p229')
      .set('noiseScale', 0.333)
      .set('noiseW', 0.333)
      .set('lengthScale', 1.3)
      .set('ssml', false)
      .set('audioTarget', 'client');
    return this.httpClient.post('http://localhost:59125/api/tts', message, {
      headers: headers,
      responseType: 'blob',
      params: params,
    });
  }
}
