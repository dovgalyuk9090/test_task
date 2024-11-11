import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./list/list.routes').then((m) => m.listRoutes),
  },
];
