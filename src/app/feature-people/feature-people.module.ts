import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleListComponent } from './containers/people-list/people-list.component';
import { ReactiveFormsModule } from "@angular/forms";
import { PeopleSimpleListComponent } from "./containers/people-simple-list/people-simple-list.component";

@NgModule({
    imports: [CommonModule, ReactiveFormsModule],
    exports: [PeopleListComponent, PeopleSimpleListComponent],
    declarations: [PeopleListComponent, PeopleSimpleListComponent]
})
export class FeaturePeopleModule {
}
