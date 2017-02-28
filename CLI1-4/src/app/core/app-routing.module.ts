import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DetailView} from "../detail-view/detail-view.component";
import {SearchComponent} from "../detail-view/search-component";
const routes: Routes = [
  {
    path: 'detail/:tab',
    component: DetailView
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'detail',
    redirectTo: '/detail/0',
    pathMatch: 'full'
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
  }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  // providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}]
})
export class AppRoutingModule {}
