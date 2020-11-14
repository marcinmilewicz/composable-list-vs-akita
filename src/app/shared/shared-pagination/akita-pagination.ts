import { getEntityType, PaginationResponse, PaginatorPlugin } from "@datorama/akita";
import { combineLatest, Observable } from "rxjs";
import { switchMap, tap } from "rxjs/operators";

export const createPaginationStream = <State, Parameters extends Record<string, object>>(
    fieldChanges: Observable<Parameters[keyof Parameters]>[],
    callback: (params: Parameters[keyof Parameters][]) => () => Observable<PaginationResponse<getEntityType<State>>>,
    paginatorRef: PaginatorPlugin<State>
) =>
    combineLatest([...fieldChanges, paginatorRef.pageChanges]).pipe(
        tap(() => paginatorRef.clearCache()),
        switchMap((values: Parameters[keyof Parameters][]) => {
console.log(values)
            const requestFunction = callback(values)

            return paginatorRef.getPage(requestFunction) as Observable<PaginationResponse<getEntityType<State>>>;
        })
    );