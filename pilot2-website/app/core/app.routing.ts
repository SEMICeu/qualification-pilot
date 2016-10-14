import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {DetailView} from "../detail-view/detail-view.component";

const appRoutes: Routes = [
  {
    path: 'qual',
    component: DetailView
  },
  {
    path: 'index.html',
    redirectTo: '/qual/0',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/qual/0',
    pathMatch: 'full'
  },
  // {
  //   path: '',
  //   component: AppComponent
  // },
  {
    path: 'qual/:tab',
    component: DetailView
  },
  // {
  //   path: 'search',
  //   component: SearchView
  // },
];


export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
