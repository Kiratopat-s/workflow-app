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

  async getCommitActivity(): Promise<Observable<any>> {

    const headers = new HttpHeaders({
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${this.TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28'
    });

    const feUrl = this.GITHUB_API_URL.replace('<REPO_NAME>', 'workflow-app')
    const beUrl = this.GITHUB_API_URL.replace('<REPO_NAME>', 'workflow-api')
    const gwUrl = this.GITHUB_API_URL.replace('<REPO_NAME>', 'workflow-final-gateway')
    console.log(feUrl, beUrl, gwUrl)
    const fe = this.http.get<any>(feUrl, { headers }).pipe(
      map(data => (data && data.length > 0) ? data.reduce((acc: any, curr: WeekCommitInfo) => acc + curr.total, 0) : 0)
    );

    const be = this.http.get<any>(beUrl, { headers }).pipe(
      map(data => (data && data.length > 0) ? data.reduce((acc: number, curr: WeekCommitInfo) => acc + curr.total, 0) : 0)
    );

    const gw = this.http.get<any>(gwUrl, { headers }).pipe(
      map(data => (data && data.length > 0) ? data.reduce((acc: any, curr: WeekCommitInfo) => acc + curr.total, 0) : 0)
    );

    console.log(fe, be, gw)

    return forkJoin({
      fe: fe,
      be: be,
      gw: gw
    });
  }
}
