import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { LoginCredentials, RegisterCredentials } from './auth-interfaces';
import { CredentialsService } from './credentials.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api/auth';

  constructor(
    private httpClient: HttpClient,
    private credentialsService: CredentialsService,
    private router: Router,
  ) {}

  login(body: LoginCredentials): Observable<any> {
    return this.httpClient.post(this.apiUrl + '/login', body).pipe(
      tap((response: any) => {
        if (response.data && response.data.access_token) {
          this.credentialsService.setCredentials(response.data, body.remember);
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/login']);
        }
      })
    );
  }

  register(body: RegisterCredentials): Observable<any> {
    return this.httpClient.post(this.apiUrl + '/register', body);
  }

  logOut(): Observable<boolean> {
    this.credentialsService.setCredentials();
    return of(true);
  }
}
