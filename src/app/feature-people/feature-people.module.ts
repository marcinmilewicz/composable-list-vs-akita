import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleListComponent } from './containers/people-list/people-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PeopleListComponent]
})
export class FeaturePeopleModule { }
