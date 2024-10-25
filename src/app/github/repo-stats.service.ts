import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { mergeMap, Observable, retryWhen, throwError, timer } from 'rxjs';
import { ENV_CONFIG } from '../../../env.config';

export interface CommitActivity {
  fe: number;
  be: number;
  gw: number;
}

@Injectable({
  providedIn: 'root'
})
export class RepoStatsService {
  private envConfig = inject(ENV_CONFIG);
  private readonly API_URL = `${this.envConfig.apiUrl}/github/total-commits`;

  constructor(private http: HttpClient) { }

  getCommitActivity(): Observable<CommitActivity> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.get<CommitActivity>(this.API_URL, { headers }).pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap(error => {
            if (error.status === 500) {
              return timer(1000);
            }
            return throwError(error);
          })
        )
      )
    );
  }
}
