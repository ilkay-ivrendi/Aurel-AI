import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginCredentials, RegisterCredentials } from './auth-interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  isAuthenticated = false;
  private apiUrl = '/api/auth';

  constructor(private httpClient: HttpClient) {}

  login(body: LoginCredentials): Observable<any> {
    return this.httpClient.post(this.apiUrl + '/login', body);
  }

  register(body: RegisterCredentials): Observable<any> {
    return this.httpClient.post(this.apiUrl + '/register', body);
  }

  logOut() {
    console.log('LogOut Clicked');
    localStorage.removeItem("test");
    this.isAuthenticated = false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}
