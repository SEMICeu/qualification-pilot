import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app-routing.module";
import {DetailView} from "../detail-view/detail-view.component";
import {DataView} from "../detail-view/data-view.component";
import {SearchComponent} from "../detail-view/search-component";

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    DetailView,
    DataView
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
