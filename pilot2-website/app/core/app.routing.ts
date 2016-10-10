import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {DetailView} from "../detail-view/detail-view.component";
import {AppComponent} from "./app.component";

const appRoutes: Routes = [
  {
    path: 'detail',
    component: DetailView
  },
  {
    path: 'index.html',
    redirectTo: '/detail/0',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/detail/0',
    pathMatch: 'full'
  },
  // {
  //   path: '',
  //   component: AppComponent
  // },
  {
    path: 'detail/:tab',
    component: DetailView
  },
];


export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
