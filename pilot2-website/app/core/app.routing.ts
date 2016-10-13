import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {DetailView} from "../detail-view/detail-view.component";
import {AppComponent} from "./app.component";
import {SearchView} from "../search-view/search-view.component";

const appRoutes: Routes = [
  {
    path: 'detail',
    component: DetailView
  },
  {
    path: 'index.html',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/search',
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
  {
    path: 'search',
    component: SearchView
  },
];


export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
