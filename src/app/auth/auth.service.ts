import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { LoggedInUser, Tokens, UserProfile } from './models/logged-in-user';
import { ENV_CONFIG } from '../env.config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private envConfig = inject(ENV_CONFIG);
  readonly URL = `${this.envConfig.apiUrl}/auth/login`;

  httpClient = inject(HttpClient);
  router = inject(Router) // add

  loggedInUser: LoggedInUser | null = null;

  login(credential: { username: string; password: string }): Observable<Tokens> {
    return this.httpClient
      .post<Tokens>(this.URL, credential)
      .pipe(tap((newToken) => this.setTokens(newToken)));
  }

  setTokens(newToken: Tokens) {
    const userProfile = jwtDecode<UserProfile>(newToken.access_token);
    this.loggedInUser = { tokens: newToken, userProfile };
  }

  // add
  logout(): void {
    this.loggedInUser = null;
    this.router.navigate(['/auth/login']);
  }
}
