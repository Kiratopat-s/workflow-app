import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { ENV_CONFIG } from '../../../env.config';

interface WeekCommitInfo {
  day: number[];
  total: number;
  week: number;
}

@Injectable({
  providedIn: 'root'
})
export class RepoStatsService {

  private envConfig = inject(ENV_CONFIG);
  readonly TOKEN = `${this.envConfig.githubToken}`;
  private readonly GITHUB_API_URL = 'https://api.github.com/repos/Kiratopat-s/<REPO_NAME>/stats/commit_activity';

  constructor(private http: HttpClient) { }

  getCommitActivity(): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${this.TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28'
    });

    const repos = ['workflow-app', 'workflow-api', 'workflow-final-gateway'];
    const requests = repos.map(repo => this.http.get<WeekCommitInfo[]>(this.GITHUB_API_URL.replace('<REPO_NAME>', repo), { headers })
      .pipe(
        map(data => data.reduce((acc, curr) => acc + curr.total, 0))
      )
    );

    return forkJoin({
      fe: requests[0],
      be: requests[1],
      gw: requests[2]
    });
  }
}
