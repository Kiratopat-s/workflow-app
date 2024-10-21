import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Item } from './models/item';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  readonly URL = 'http://localhost:3000/items';
  private httpClient = inject(HttpClient)

  constructor() { }

  list(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(this.URL);
  }
}
