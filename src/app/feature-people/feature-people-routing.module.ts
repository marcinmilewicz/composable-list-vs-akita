import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PeopleListComponent } from './containers/people-list/people-list.component';

const routes: Routes = [
    { path: '', component: PeopleListComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeaturePeopleRoutingModule {
}
