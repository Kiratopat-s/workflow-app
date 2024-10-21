import { Routes } from '@angular/router';
import { ItemEntryComponent } from './pages/item-entry/item-entry.component';
import { ItemFormComponent } from './pages/item-form/item-form.component';
import { ItemApprovalComponent } from './pages/item-approval/item-approval.component';

export const routes: Routes = [
  { path: 'item-entry', component: ItemEntryComponent, title: 'Entry' },
  { path: 'item-add', component: ItemFormComponent, title: 'Add' },
  { path: 'item-edit/:id', component: ItemFormComponent, title: 'Edit' },
  { path: 'item-approval', component: ItemApprovalComponent, title: 'Approval' }
];

export default routes;
