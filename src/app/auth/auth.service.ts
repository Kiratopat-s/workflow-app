import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { LoggedInUser, Tokens, UserProfile } from './models/logged-in-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly URL = 'http://localhost:3000/auth/login';

  httpClient = inject(HttpClient);

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
}
