import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CompaniesState, CompaniesStore } from './companies.store';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CompaniesQuery extends QueryEntity<CompaniesState> {
    countries$: Observable<string[]> = this.select('countries');

    constructor(protected store: CompaniesStore) {
        super(store);
    }
}
