import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { CommonModule } from "@angular/common";
import { PersonList } from "./person.list";
import { PagesPipe } from './pages.pipe';

@NgModule({
  imports: [BrowserModule, FormsModule, CommonModule],
  declarations: [AppComponent, PagesPipe],
  bootstrap: [AppComponent],
  providers: [PersonList]
})
export class AppModule {}
