import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyListComponent } from './containers/companies-list/company-list.component';
import { CompanyListResolver } from './resolvers/company-list.resolver';

const routes: Routes = [
    { path: '', component: CompanyListComponent, resolve: { countries: CompanyListResolver } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeatureCompaniesRoutingModule {
}
