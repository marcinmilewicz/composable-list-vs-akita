import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { combineLatest, Observable } from "rxjs";
import { PaginationResponse, PaginatorPlugin } from "@datorama/akita";
import { Person } from "../../state/people.model";
import { PEOPLE_PAGINATOR } from "../../state/people-paginator";
import { PeopleService } from "../../state/people.service";
import { FormBuilder } from "@angular/forms";
import { untilDestroyed } from "ngx-take-until-destroy";
import { startWith, switchMap, tap } from "rxjs/operators";


const createPaginationStream = <Model, Parameters extends Record<string, object>>(
    fieldChanges: Observable<Parameters[keyof Parameters]>[],
    callback: (params: Parameters[keyof Parameters][]) => Observable<PaginationResponse<Model>>,
    paginatorRef: PaginatorPlugin<Model>
) =>
    combineLatest(fieldChanges).pipe(
        tap(() => paginatorRef.clearCache()),
        switchMap((values: Parameters[keyof Parameters][]) => {

            const requestFunction = () => callback(values)

            return paginatorRef.getPage(requestFunction) as Observable<PaginationResponse<Model>>;
        })
    );


@Component({
    selector: "app-people-list",
    templateUrl: "./people-list.component.html",
    styleUrls: ["./people-list.component.css"]
})
export class PeopleListComponent implements OnInit, OnDestroy {
    people$: Observable<PaginationResponse<Person>>;
    form = this.formBuilder.group({
        sort: ["name"],
        query: [""],
        perPage: [10]
    });

    constructor(
        @Inject(PEOPLE_PAGINATOR) public paginatorRef: PaginatorPlugin<Person>,
        private formBuilder: FormBuilder,
        private peopleService: PeopleService
    ) {
    }

    ngOnInit() {
        const sort$ = this.form.get("sort").valueChanges.pipe(startWith("name"));
        const query$ = this.form.get("query").valueChanges.pipe(startWith(""));
        const perPage$ = this.form.get("perPage").valueChanges.pipe(startWith(10));


        const queryFactory = ([sortBy, query, perPage, page]) => this.peopleService.get({page, query, sortBy, perPage});

        this.people$ = createPaginationStream([sort$, query$, perPage$], queryFactory, this.paginatorRef).pipe(
            tap((value) => console.log('tap',value)),
            untilDestroyed(this)
        );

        // this.people$ = combineLatest([
        //     sort$.pipe(tap(() => this.paginatorRef.clearCache())),
        //     query$.pipe(tap(() => this.paginatorRef.clearCache())),
        //     perPage$.pipe(tap(() => this.paginatorRef.clearCache())),
        //     this.paginatorRef.pageChanges
        // ]).pipe(
        //     switchMap(([sortBy, query, perPage, page]) => {
        //         const requestFn = () =>
        //             this.peopleService.get({page, query, sortBy, perPage});
        //         // In order to remember last sorting params. It doest not required
        //         this.paginatorRef.metadata.set("sortBy", sortBy);
        //         this.paginatorRef.metadata.set("perPage", perPage);
        //         this.paginatorRef.metadata.set("query", query);
        //         return this.paginatorRef.getPage(requestFn) as Observable<PaginationResponse<Person>>;
        //     }),
        //     untilDestroyed(this)
        // );
    }

    ngOnDestroy() {
        this.paginatorRef.destroy();
    }
}
