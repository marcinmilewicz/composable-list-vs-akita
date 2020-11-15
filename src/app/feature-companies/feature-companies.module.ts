import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedPaginationModule } from '../shared/shared-pagination/shared-pagination.module';
import { FeatureCompaniesRoutingModule } from './feature-companies-routing.module';
import { CompanyListComponent } from './containers/companies-list/company-list.component';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, SharedPaginationModule, FeatureCompaniesRoutingModule],
    declarations: [CompanyListComponent],
})
export class FeatureCompaniesModule {}
