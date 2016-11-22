import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {DetailView} from "../detail-view/detail-view.component";
import {DetailViewTab} from "../detail-view/detail-view-tab.component";

@NgModule({
  declarations: [
    AppComponent,
    DetailView,
    DetailViewTab
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
