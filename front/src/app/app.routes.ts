// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { PublicLayoutComponent } from '@layouts/public-layout/public-layout.component';
import { PrivateLayoutComponent } from '@layouts/private-layout/private-layout.component';

import { publicRoutes } from '@features/public/public.routes';
import { privateRoutes } from '@features/private/private.routes';

import { isConnectGuard } from '@core/guard/is-connect.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'public/login' },

  {
    path: 'public',
    component: PublicLayoutComponent,
    children: publicRoutes,
  },

  {
    path: 'private',
    component: PrivateLayoutComponent,
    canActivate: [isConnectGuard],
    children: privateRoutes,
  },

  { path: '**', redirectTo: 'public/login' },
];