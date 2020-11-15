import { getEntityType, PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { combineLatest, Observable } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

// @ts-ignore
// todo working only with Typescript 4.1.0
//export type StreamedParameters<Parameters> = Partial<{ [K in keyof Parameters as `${K}$`]: Observable<Parameters[K]> }>
export type StreamedParameters<Parameters> = Partial<{ [K in keyof Parameters as any]: Observable<Parameters[K]> }>

export const createInitialParameters = <State, Parameters>(paginatorRef: PaginatorPlugin<State>, parameters: Parameters): Partial<{ [K in keyof Parameters]: Parameters[K] }> =>
    Object.keys(parameters).reduce((result, key) => {
        result[key] = paginatorRef.metadata.get(key) || parameters[key];
        return result;
    }, {})

export const getFormStreams = <Parameters>(form: FormGroup, initialParameters: Parameters): StreamedParameters<Parameters> =>
    Object.keys(initialParameters).reduce((result: StreamedParameters<Parameters>, key) => {
        result[`$${key}`] = form.get(key).valueChanges.pipe(startWith(initialParameters[key] as object))
        return result;
    }, {})

export const persistParametersMetaData = <State, Parameters>(paginatorRef: PaginatorPlugin<State>, params: Partial<{ [K in keyof Parameters]: Parameters[K] }>): void =>
    Object.keys(params).forEach((parameter) => paginatorRef.metadata.set(parameter, params[parameter]));

export interface PaginationStreamContext<State, Parameters> {
    create: () => Observable<PaginationResponse<getEntityType<State>>>,
    withInitialParameters: (fields: Partial<{ [K in keyof Parameters]: any }>) => Partial<PaginationStreamContext<State, Parameters>>,
    withFetch: (fetchFunction: (params: Parameters[keyof Parameters][]) => () => Observable<PaginationResponse<getEntityType<State>>>) => Partial<PaginationStreamContext<State, Parameters>>,
    withAction: (actionFunction: (params: Parameters[keyof Parameters][]) => void) => Partial<PaginationStreamContext<State, Parameters>>,
    withCache: () => Partial<PaginationStreamContext<State, Parameters>>
}

export const createPaginationStream = <State, Parameters extends { [K in keyof Parameters]: Parameters[K] }>(
    fieldChanges: Observable<Parameters[keyof Parameters]>[],
    callback: (params: Parameters[keyof Parameters][]) => () => Observable<PaginationResponse<getEntityType<State>>>,
    paginatorRef: PaginatorPlugin<State>
) =>
    combineLatest([...fieldChanges, paginatorRef.pageChanges]).pipe(
        tap(() => paginatorRef.clearCache()),
        switchMap((values: Parameters[keyof Parameters][]) => paginatorRef.getPage(callback(values)))
    );

export const newPaginableStream = <State, Parameters extends Record<string, object>>(
    paginatorRef: PaginatorPlugin<State>,
    form: FormGroup
) => {
    const context: Partial<PaginationStreamContext<State, Parameters>> = {}
    let initialParameters: Partial<{ [K in keyof Parameters]: Parameters[K] }>
    let fetchFunction: (params: Parameters[keyof Parameters][]) => () => Observable<PaginationResponse<getEntityType<State>>>;
    let actionFunction: (params: Parameters[keyof Parameters][]) => () => void;
    let persistCache = false;

    context.withInitialParameters = (value: Partial<{ [K in keyof Parameters]: Parameters[K] }>) => {
        initialParameters = value;
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

        const fieldStreams: Observable<Parameters[keyof Parameters]>[] = Object.values(getFormStreams(form, initialParameters));

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

