import { Routes } from '@angular/router';
import { ItemEntryComponent } from './pages/item-entry/item-entry.component';
import { ItemFormComponent } from './pages/item-form/item-form.component';

export const routes: Routes = [
  { path: 'item-entry', component: ItemEntryComponent, title: 'Entry' },
  { path: 'item-add', component: ItemFormComponent, title: 'Add' },
  { path: 'item-edit/:id', component: ItemFormComponent, title: 'Edit' }
];

export default routes;
