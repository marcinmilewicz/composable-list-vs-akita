import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeopleSimpleListComponent } from "./containers/people-simple-list/people-simple-list.component";
import { PeopleListComponent } from "./containers/people-list/people-list.component";

const routes: Routes = [
    {path: 'simple', component: PeopleSimpleListComponent},
    {path: 'withQuery', component: PeopleListComponent},
    {path: '', redirectTo: 'simple', pathMatch: 'full'},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeaturePeopleRoutingModule {
}
