import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucideAngularModule, Github, GitCommit, BookUp2 } from 'lucide-angular';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { RepoStatsService } from './repo-stats.service';

@Component({
  selector: 'app-github',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, LucideAngularModule],
  providers: [RepoStatsService],
  templateUrl: './github.component.html',
  styleUrl: './github.component.scss'
})
export class GithubComponent implements OnInit {
  readonly icons = {
    Github: Github,
    GitCommit: GitCommit,
    Bookmark: BookUp2
  };
  title = 'Workflow-app';

  feCommits: number | string = 'Fetching...';
  beCommits: number | string = 'Fetching...';
  gwCommits: number | string = 'Fetching...';

  constructor(private repoStatsService: RepoStatsService) { }

  async ngOnInit() {
    (await this.repoStatsService.getCommitActivity()).subscribe((res) => {
      console.log(res);
      this.feCommits = res.fe;
      this.beCommits = res.be;
      this.gwCommits = res.gw;
    });
  }
}
