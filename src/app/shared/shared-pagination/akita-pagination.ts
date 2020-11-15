import { getEntityType, PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { combineLatest, Observable } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

// @ts-ignore
// todo working locally only with Typescript 4.1.0 (string templates in type AND 'as' parameter in types) (Stackblitz has issue with this version, Prettier also)
//export type StreamedParameters<Parameters> = Partial<{ [K in keyof Parameters as `${K}$`]: Observable<Parameters[K]> }>
export type StreamedParameters<Parameters> = any;
export type ParametersWithPageIdentifier<Parameters> = Partial<Parameters> & { page: number };

export interface PaginationStreamContext<State, Parameters> {
    create: () => Observable<PaginationResponse<getEntityType<State>>>;
    withInitialParameters: (fields: Partial<{ [K in keyof Parameters]: any }>) => Partial<PaginationStreamContext<State, Parameters>>;
    withFetch: (
        fetchFunction: (params: Parameters[keyof Parameters][]) => () => Observable<PaginationResponse<getEntityType<State>>>
    ) => Partial<PaginationStreamContext<State, Parameters>>;
    withAction: (actionFunction: (params: Parameters[keyof Parameters][]) => void) => Partial<PaginationStreamContext<State, Parameters>>;
    withCache: () => Partial<PaginationStreamContext<State, Parameters>>;
}

export const _createInitialParametersFactory = <State>(paginatorRef: PaginatorPlugin<State>) => <Parameters>(parameters: Parameters): Partial<Parameters> =>
    Object.keys(parameters).reduce((result, key) => {
        result[key] = paginatorRef.metadata.get(key) || parameters[key];
        return result;
    }, {});

export const _persistParametersMetaDataFactory = <State>(paginatorRef: PaginatorPlugin<State>) => <Parameters>(
    params: ParametersWithPageIdentifier<Parameters>
): void => Object.keys(params).forEach((parameter) => paginatorRef.metadata.set(parameter, params[parameter]));

export const _getFormStreams = <Parameters>(form: FormGroup, initialParameters: Parameters): StreamedParameters<Parameters> =>
    Object.keys(initialParameters).reduce((result: StreamedParameters<Parameters>, key) => {
        result[`$${key}`] = form.get(key).valueChanges.pipe(startWith(initialParameters[key] as object));
        return result;
    }, {});

export const _paginationBuilderFactory = <State, Parameters>(paginatorRef: PaginatorPlugin<State>) => <Parameters>(form: FormGroup) => {
    const context: Partial<PaginationStreamContext<State, Parameters>> = {};
    let initialParameters: Partial<Parameters>;
    let fetchFunction: (params: Parameters[keyof Parameters][]) => <S>() => Observable<PaginationResponse<getEntityType<S>>>;
    let actionFunction: (params: Parameters[keyof Parameters][]) => () => void;
    let persistCache = false;

    context.withInitialParameters = (value: Partial<Parameters>) => {
        initialParameters = value;
        return context;
    };

    context.withFetch = (callback: (params: Parameters[keyof Parameters][]) => () => Observable<PaginationResponse<getEntityType<State>>>) => {
        fetchFunction = callback.bind({});
        return context;
    };

    context.withAction = (callback: (params: Parameters[keyof Parameters][]) => void) => {
        actionFunction = callback.bind({});
        return context;
    };

    context.withCache = () => {
        persistCache = true;
        return context;
    };

    context.create = () => {
        if (!persistCache) {
            paginatorRef.clearCache();
        }

        const fieldStreams: Observable<Parameters[keyof Parameters]>[] = Object.values(_getFormStreams(form, initialParameters));

        return combineLatest([...fieldStreams, paginatorRef.pageChanges]).pipe(
            tap(() => paginatorRef.clearCache()),
            tap((values: Parameters[keyof Parameters][]) => {
                if (typeof actionFunction === 'function') {
                    actionFunction(values);
                }
            }),
            switchMap((values: Parameters[keyof Parameters][]) =>
                paginatorRef.getPage(fetchFunction(values)).pipe(tap(({ currentPage }) => paginatorRef.setPage(currentPage)))
            )
        );
    };

    return context;
};

export const paginationTools = <State>(paginatorRef: PaginatorPlugin<State>) => ({
    createInitialParameters: _createInitialParametersFactory(paginatorRef),
    persistParametersMetaData: _persistParametersMetaDataFactory(paginatorRef),
    paginationBuilder: _paginationBuilderFactory(paginatorRef),
});
