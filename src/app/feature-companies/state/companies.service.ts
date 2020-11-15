import { Injectable } from '@angular/core';
import { PaginationResponse } from '@datorama/akita';
import { Company } from './companies.model';
import { Observable } from 'rxjs';
import { getCompanies, getCountries } from '../../data'
import { tap } from 'rxjs/operators';
import { CompaniesStore } from './companies.store';

@Injectable({ providedIn: 'root' })
export class CompaniesService {

    constructor(private store: CompaniesStore) {
    }

    get(params): Observable<PaginationResponse<Company>> {
        return getCompanies(params);
    }

    fetchCountries(): Observable<string[]> {
        return getCountries().pipe(
            tap((countries) => this.store.update(_ => ({ countries })))
        );
    }
}
