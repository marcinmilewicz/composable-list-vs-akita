import { Component, Inject, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { Person } from '../../state/people.model';
import { PEOPLE_PAGINATOR } from '../../state/people-paginator';
import { PeopleService } from '../../state/people.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { startWith, tap } from 'rxjs/operators';
import { PeopleState } from '../../state/people.store';
import { createInitialParameters, newPaginationStream, persistParametersMetaData } from '../../../shared/shared-pagination/akita-pagination';

interface PeopleListParameters {
    sortBy: string;
    perPage: number;
    query: string
}

const initialParameters: PeopleListParameters = { sortBy: 'name', perPage: 10, query: '' };

@Component({
    selector: 'app-people-list',
    templateUrl: './people-list.component.html',
    styleUrls: ['./people-list.component.css']
})
export class PeopleListComponent implements OnDestroy {
    people$: Observable<PaginationResponse<Person>>;
    form: FormGroup;

    constructor(
        @Inject(PEOPLE_PAGINATOR) public paginatorRef: PaginatorPlugin<PeopleState>,
        private formBuilder: FormBuilder,
        private peopleService: PeopleService
    ) {
        const { query, sortBy, perPage } = createInitialParameters(this.paginatorRef, initialParameters);

        this.form = this.formBuilder.group({
            sortBy: [sortBy],
            query: [query],
            perPage: [perPage],
        });

        const fetchFunction = ([sortBy, query, perPage, page]) =>
            () => this.peopleService.get({ page, query, sortBy, perPage });

        const persistParameters = ([sortBy, query, perPage, page]) =>
            persistParametersMetaData(paginatorRef, { page, query, sortBy, perPage })

        this.people$ = newPaginationStream(this.paginatorRef, this.form)
            .withInitialParameters({ sortBy, query, perPage })
            .withFetch(fetchFunction)
            .withAction(persistParameters)
            .withCache()
            .create()
            .pipe(untilDestroyed(this));
    }

    ngOnDestroy() {
        this.paginatorRef.destroy();
    }
}
