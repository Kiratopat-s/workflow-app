import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateItem, Item } from './models/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  readonly URL = 'http://localhost:3000/items';
  private httpClient = inject(HttpClient);

  constructor() { }

  list() {
    return this.httpClient.get<Item[]>(this.URL);
  }

  add(item: CreateItem) {
    return this.httpClient.post<Item>(this.URL, item);
  }
}
