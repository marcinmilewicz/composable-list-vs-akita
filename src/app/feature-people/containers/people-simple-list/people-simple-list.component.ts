import { Component, Inject, OnDestroy } from "@angular/core";
import { Observable } from "rxjs";
import { PaginationResponse, PaginatorPlugin } from "@datorama/akita";
import { Person } from "../../state/people.model";
import { PEOPLE_PAGINATOR } from "../../state/people-paginator";
import { PeopleService } from "../../state/people.service";
import { FormBuilder } from "@angular/forms";
import { untilDestroyed } from "ngx-take-until-destroy";
import { startWith } from "rxjs/operators";
import { PeopleState } from "../../state/people.store";
import { createPaginationStream } from "../../../shared/shared-pagination/akita-pagination";


@Component({
    selector: "app-people-simple-list",
    templateUrl: "./people-simple-list.component.html",
    styleUrls: ["./people-simple-list.component.css"]
})
export class PeopleSimpleListComponent implements OnDestroy {
    people$: Observable<PaginationResponse<Person>>;
    form = this.formBuilder.group({
        sort: ["name"],
        query: [""],
        perPage: [10]
    });

    constructor(
        @Inject(PEOPLE_PAGINATOR) public paginatorRef: PaginatorPlugin<PeopleState>,
        private formBuilder: FormBuilder,
        private peopleService: PeopleService
    ) {
        const sort$ = this.form.get("sort").valueChanges.pipe(startWith("name"));
        const perPage$ = this.form.get("perPage").valueChanges.pipe(startWith(10));

        const queryFactory = ([sortBy, perPage, page]) =>
            () => this.peopleService.get({page, sortBy, perPage});

        this.people$ = createPaginationStream([sort$, perPage$], queryFactory, this.paginatorRef).pipe(
            untilDestroyed(this)
        );
    }

    ngOnDestroy() {
        this.paginatorRef.destroy();
    }
}
