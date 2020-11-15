import { Component, Inject, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { Person } from '../../state/people.model';
import { PEOPLE_PAGINATOR } from '../../state/people-paginator';
import { PeopleService } from '../../state/people.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { PeopleState } from '../../state/people.store';
import { paginationTools } from '../../../shared/shared-pagination/akita-pagination';

interface PeopleListParameters {
    sortBy: string;
    perPage: number;
    query: string;
}

const initialParameters: PeopleListParameters = { sortBy: 'name', perPage: 10, query: '' };

@Component({
    selector: 'app-people-list',
    templateUrl: './people-list.component.html',
    styleUrls: ['./people-list.component.css'],
})
export class PeopleListComponent implements OnDestroy {
    people$: Observable<PaginationResponse<Person>>;
    form: FormGroup;

    constructor(
        @Inject(PEOPLE_PAGINATOR) public paginator: PaginatorPlugin<PeopleState>,
        private formBuilder: FormBuilder,
        private peopleService: PeopleService
    ) {
        const { createInitialParameters, persistParametersMetaData, paginationBuilder } = paginationTools(paginator);

        const { query, sortBy, perPage } = createInitialParameters(initialParameters);

        this.form = this.formBuilder.group({
            sortBy: [sortBy],
            query: [query],
            perPage: [perPage],
        });

        const fetchFunction = <PeopleState>([sortBy, query, perPage, page]) => () => this.peopleService.get({ page, query, sortBy, perPage });

        const persistParameters = ([sortBy, query, perPage, page]) => persistParametersMetaData({ page, query, sortBy, perPage });

        this.people$ = paginationBuilder<PeopleListParameters>(this.form)
            .withInitialParameters({ sortBy, query, perPage })
            .withFetch(fetchFunction)
            .withAction(persistParameters)
            .withCache()
            .create()
            .pipe(untilDestroyed(this));
    }

    ngOnDestroy() {
        this.paginator.destroy();
    }
}
