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
import { newPaginationStream } from '../../../shared/shared-pagination/akita-pagination';

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
        const initialSort: string = this.paginatorRef.metadata.get('sortBy') || 'name';
        const initialPerPage: number = this.paginatorRef.metadata.get('perPage') || 10;
        const initialQuery: number = this.paginatorRef.metadata.get('query') || '';

        this.form = this.formBuilder.group({
            sort: [initialSort],
            query: [initialQuery],
            perPage: [initialPerPage]
        });

        const sort$ = this.form.get('sort').valueChanges.pipe(startWith(initialSort));
        const query$ = this.form.get('query').valueChanges.pipe(startWith(initialQuery));
        const perPage$ = this.form.get('perPage').valueChanges.pipe(startWith(initialPerPage));

        const fetchFunction = ([sortBy, query, perPage, page]) =>
            () => this.peopleService.get({ page, query, sortBy, perPage });

        // this.people$ = paginationStream(this.paginatorRef)
        //     .forFields([sort$, query$, perPage$])
        //     .withFetch(fetchFunction)
        //     .withAction(([sortBy, query, perPage]) => {
        //         console.log([sortBy, query, perPage])
        //         this.paginatorRef.metadata.set('perPage', perPage);
        //         this.paginatorRef.metadata.set('sortBy', sortBy);
        //         this.paginatorRef.metadata.set('query', query);
        //     })
        //     .withCache()
        //     .create()
        //     .pipe(untilDestroyed(this));
    }

    ngOnDestroy() {
        this.paginatorRef.destroy();
    }
}
