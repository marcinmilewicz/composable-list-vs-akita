import { getEntityType, PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { combineLatest, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

export interface PaginationStreamContext<State, Parameters> {
    create: () => Observable<PaginationResponse<getEntityType<State>>>,
    forFields: (fields: Observable<Parameters[keyof Parameters]>[]) => Partial<PaginationStreamContext<State, Parameters>>,
    withFetch: (fetchFunction: (params: Parameters[keyof Parameters][]) => () => Observable<PaginationResponse<getEntityType<State>>>) => Partial<PaginationStreamContext<State, Parameters>>,
    withAction: (actionFunction: (params: Parameters[keyof Parameters][])  => void) => Partial<PaginationStreamContext<State, Parameters>>,
    withCache: () => Partial<PaginationStreamContext<State, Parameters>>
}

export const createPaginationStream = <State, Parameters extends Record<string, object>>(
    fieldChanges: Observable<Parameters[keyof Parameters]>[],
    callback: (params: Parameters[keyof Parameters][]) => () => Observable<PaginationResponse<getEntityType<State>>>,
    paginatorRef: PaginatorPlugin<State>
) =>
    combineLatest([...fieldChanges, paginatorRef.pageChanges]).pipe(
        tap(() => paginatorRef.clearCache()),
        switchMap((values: Parameters[keyof Parameters][]) => paginatorRef.getPage(callback(values)))
    );

export const paginationStream = <State, Parameters extends Record<string, object>>(
    paginatorRef: PaginatorPlugin<State>
) => {
    const context: Partial<PaginationStreamContext<State, Parameters>> = {}
    let fieldStreams: Observable<Parameters[keyof Parameters]>[];
    let fetchFunction: (params: Parameters[keyof Parameters][]) => () => Observable<PaginationResponse<getEntityType<State>>>;
    let actionFunction: (params: Parameters[keyof Parameters][]) => () => void;
    let persistCache = false;

    context.forFields = (fields: Observable<Parameters[keyof Parameters]>[]) => {
        fieldStreams = [...fields];

        return context;
    }

    context.withFetch = (callback: (params: Parameters[keyof Parameters][]) => () => Observable<PaginationResponse<getEntityType<State>>>) => {
        fetchFunction = callback.bind({})

        return context;
    }

    context.withAction = (callback: (params: Parameters[keyof Parameters][]) => void) => {
        actionFunction = callback.bind({})

        return context;
    }

    context.withCache = () => {
        persistCache = true;

        return context;
    }

    context.create = () => {
        if (!persistCache) {
            paginatorRef.clearCache()
        }

        return combineLatest([...fieldStreams, paginatorRef.pageChanges]).pipe(
            tap(() => paginatorRef.clearCache()),
            tap((values: Parameters[keyof Parameters][]) => {
                if (typeof actionFunction === 'function') {
                    actionFunction(values);
                }
            }),
            switchMap((values: Parameters[keyof Parameters][]) => paginatorRef.getPage(fetchFunction(values)))
        );
    }

    return context;
}

