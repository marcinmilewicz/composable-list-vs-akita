import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleListComponent } from './containers/people-list/people-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedPaginationModule } from '../shared/shared-pagination/shared-pagination.module';
import { FeaturePeopleRoutingModule } from './feature-people-routing.module';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, SharedPaginationModule, FeaturePeopleRoutingModule],
    declarations: [PeopleListComponent]
})
export class FeaturePeopleModule {
}
