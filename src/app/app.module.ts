import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { CommonModule } from "@angular/common";
import { PersonList } from "./person.list";
import { PagesPipe } from './pages.pipe';
import { FeaturePeopleModule } from "./feature-people/feature-people.module";

@NgModule({
  imports: [BrowserModule, FormsModule, CommonModule, FeaturePeopleModule],
  declarations: [AppComponent, PagesPipe],
  bootstrap: [AppComponent],
  providers: [PersonList]
})
export class AppModule {}
