import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginCredentials, RegisterCredentials } from './auth-interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}
  private apiUrl = '/api/auth';
  login(body: LoginCredentials): Observable<any> {
    return this.httpClient.post(this.apiUrl + '/login', body);
  }

  register(body: RegisterCredentials): Observable<any> {
    return this.httpClient.post(this.apiUrl + '/register', body);
  }

  logOut() {
    console.log('LogOut Clicked');
  }
}
