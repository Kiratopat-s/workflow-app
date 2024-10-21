import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'budget', loadChildren: () => import('./budget/budget.routes') }
];
