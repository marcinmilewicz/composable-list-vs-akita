import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleListComponent } from './containers/people-list/people-list.component';
import { ReactiveFormsModule } from "@angular/forms";
import { PeopleSimpleListComponent } from "./containers/people-simple-list/people-simple-list.component";
import { SharedPaginationModule } from "../shared/shared-pagination/shared-pagination.module";
import { FeaturePeopleRoutingModule } from "./feature-people-routing.module";

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, SharedPaginationModule, FeaturePeopleRoutingModule],
    exports: [PeopleListComponent, PeopleSimpleListComponent],
    declarations: [PeopleListComponent, PeopleSimpleListComponent]
})
export class FeaturePeopleModule {
}
