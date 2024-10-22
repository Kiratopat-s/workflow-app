import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { ENV_CONFIG } from '../env.config';
import { LoggedInUser, Tokens } from './models/logged-in-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // change to use envConfig
  private envConfig = inject(ENV_CONFIG);
  readonly URL = `${this.envConfig.apiUrl}/auth/login`;

  httpClient = inject(HttpClient);

  tokens = signal<Tokens | null>(null);
  loggedInUser = computed(() => {
    const tokens = this.tokens();
    if (tokens) {
      return jwtDecode<LoggedInUser>(tokens.access_token);
    }
    return null;
  });

  login(credential: { username: string; password: string }): Observable<Tokens> {
    return this.httpClient.post<Tokens>(this.URL, credential).pipe(
      tap((v) => {
        this.tokens.set(v);
      })
    );
  }
}
