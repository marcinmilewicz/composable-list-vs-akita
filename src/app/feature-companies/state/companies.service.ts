import { Injectable } from '@angular/core';
import { PaginationResponse } from '@datorama/akita';
import { Company } from './companies.model';
import { Observable } from 'rxjs';
import { addCompany, getCompanies, getCountries, updateCompany } from '../../data'
import { tap } from 'rxjs/operators';
import { CompaniesStore } from './companies.store';

@Injectable({ providedIn: 'root' })
export class CompaniesService {

    constructor(private store: CompaniesStore) {
    }

    get(params): Observable<PaginationResponse<Company>> {
        return getCompanies(params);
    }

    addCompany(): Observable<Pick<Company, 'id'>> {
        return addCompany();
    }

    updateCompany(id: number): Observable<Pick<Company, 'id'>> {
        return updateCompany(id);
    }

    fetchCountries(): Observable<string[]> {
        return getCountries().pipe(
            tap((countries) => this.store.update(_ => ({ countries })))
        );
    }
}
