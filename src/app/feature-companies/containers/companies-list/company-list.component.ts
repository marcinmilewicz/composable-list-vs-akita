import { Component, Inject, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { Company } from '../../state/companies.model';
import { COMPANIES_PAGINATOR } from '../../state/companies-paginator';
import { CompaniesService } from '../../state/companies.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CompaniesState } from '../../state/companies.store';
import { createInitialParameters, newPaginableStream, persistParametersMetaData } from '../../../shared/shared-pagination/akita-pagination';
import { CompaniesQuery } from '../../state/companies.query';
import { tap } from 'rxjs/operators';

const sortingOptions = [
    { value: 'id', label: 'Id - asc' },
    { value: '-id', label: 'Id - desc' },
    { value: 'name', label: 'Name - asc' },
    { value: '-name', label: 'Name - desc' },
    { value: 'product', label: 'Product - asc' },
    { value: '-product', label: 'Product - desc' }
]

interface CompaniesListParameters {
    sortBy: string;
    perPage: number;
    country: string;
    query: string
}

const initialParameters: CompaniesListParameters = { sortBy: 'name', perPage: 10, country: '', query: '' }

@Component({
    selector: 'app-company-list',
    templateUrl: './company-list.component.html',
    styleUrls: ['company-list.component.css']
})

export class CompanyListComponent implements OnDestroy {
    companies$: Observable<PaginationResponse<Company>>;
    countries$: Observable<string[]> = this.companiesQuery.countries$;
    actionTrigger = new Subject();

    form: FormGroup;

    sortingOptions = sortingOptions;

    constructor(
        @Inject(COMPANIES_PAGINATOR) public paginatorRef: PaginatorPlugin<CompaniesState>,
        private formBuilder: FormBuilder,
        private companiesService: CompaniesService,
        private companiesQuery: CompaniesQuery
    ) {
        const { country, query, sortBy, perPage } = createInitialParameters(this.paginatorRef, initialParameters);

        this.form = this.formBuilder.group({
            sortBy: [sortBy],
            query: [query],
            perPage: [perPage],
            country: [country]
        });

        const fetchFunction = ([sortBy, query, country, perPage, page]) =>
            () => this.companiesService.get({ page, query, country, sortBy, perPage });

        const persistParameters = ([sortBy, query, country, perPage, page]) =>
            persistParametersMetaData(paginatorRef, { page, query, country, sortBy, perPage })

        this.companies$ = newPaginableStream(this.paginatorRef, this.form)
            .withInitialParameters({ sortBy, query, country, perPage })
            .withFetch(fetchFunction)
            .withAction(persistParameters)
            .withCache()
            .create()
            .pipe(untilDestroyed(this));
    }

    add(): void {
        this.companiesService.addCompany().pipe(
            tap(() => this.paginatorRef.refreshCurrentPage()),
            untilDestroyed(this)
        ).subscribe()
    }

    modify(id: number): void {
        this.companiesService.updateCompany(id).pipe(
            tap(() => this.paginatorRef.refreshCurrentPage()),
            untilDestroyed(this)
        ).subscribe()
    }

    ngOnDestroy() {
        this.paginatorRef.destroy();
    }
}
