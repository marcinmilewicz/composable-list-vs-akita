import { inject, InjectionToken } from '@angular/core';
import { CompaniesQuery } from './companies.query';
import { PaginatorPlugin } from '@datorama/akita';

export const COMPANIES_PAGINATOR = new InjectionToken('COMPANIES_PAGINATOR', {
    providedIn: 'root',
    factory: () => {
        const companiesQuery = inject(CompaniesQuery);
        return new PaginatorPlugin(companiesQuery).withControls().withRange();
    }
});
