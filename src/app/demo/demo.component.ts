import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { filter, interval, map, of, startWith, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss'
})
export class DemoComponent {

  // finit observable
  numbers$ = of([1, 2, 3, 4, 5])
  numbers: number[] = []

  httpClient = inject(HttpClient)
  users: any

  // infinit observable
  clock$ = interval(1000 * 1)
  now = new Date

  sideEffect = ''

  inputBox = new FormControl<string>('Angular')
  outputText = ''

  post: any

  constructor() {

    // # 1
    // this.numbers$ as a Observable
    // (vs => this.numbers = vs) as a คนสังเกต
    this.numbers$.subscribe(vs => this.numbers = vs)

    // # 2
    // this.httpClient.get('https://jsonplaceholder.typicode.com/users') as a Observable
    // (vs => this.users = vs) as a คนสังเกต
    this.httpClient.get<any[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe(vs => this.users = vs)

    // # 3
    // this.clock$  as a Observable (สิ่งที่สังเกตได้)
    // v => this.now = new Date() as a คนสังเกต (Observer)
    this.clock$.subscribe(v => this.now = new Date())

    // # 4
    /*
    this.inputBox.valueChanges.pipe(
      startWith(this.inputBox.value),
      filter((x) => x != null),
      tap((v) => this.sideEffect = v?.toUpperCase())
    )
    as a Observable (สิ่งที่สังเกตได้)

    */
    // v => this.outputText = v as a คนสังเกต (Observer)
    this.inputBox.valueChanges.pipe(
      startWith(this.inputBox.value),
      filter((x) => x != null),
      tap((v) => this.sideEffect = v?.toUpperCase())
    ).subscribe(v => this.outputText = v)



  }

}
