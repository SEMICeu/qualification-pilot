import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './app.component';
import {routing} from "./app.routing";
import { DetailView } from '../detail-view/detail-view.component';
import {DetailViewTab} from "../detail-view/detail-view-tab.component";
import {SearchView} from "../search-view/search-view.component";

@NgModule({
  imports: [ BrowserModule, FormsModule, HttpModule,
      routing
      ],
  declarations: [ AppComponent,
      DetailView,
      DetailViewTab
  ],
  bootstrap: [ AppComponent ]

})
export class AppModule { }
