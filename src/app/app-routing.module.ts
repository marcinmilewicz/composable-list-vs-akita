import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: 'people', loadChildren: () => import('./feature-people/feature-people.module').then(m => m.FeaturePeopleModule) },
    { path: 'companies', loadChildren: () => import('./feature-companies/feature-companies.module').then(m => m.FeatureCompaniesModule) },
    { path: '', redirectTo: 'people', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
