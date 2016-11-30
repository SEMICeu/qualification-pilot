import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import {DetailView} from "../detail-view/detail-view.component";
const routes: Routes = [
  {
    path: 'detail',
    component: DetailView
  },
  {
    path: 'index.html', //TODO redirect more appropriately
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
  // {
  //   path: 'search',
  //   component: SearchView
  // },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  // providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}]
})
export class AppRoutingModule {}
