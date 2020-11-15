import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Company } from './companies.model';

export interface CompaniesState extends EntityState<Company> {
    countries: string[];
}

const initialState: CompaniesState = {
    countries: [],
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'companies' })
export class CompaniesStore extends EntityStore<CompaniesState> {
    constructor() {
        super(initialState);
    }
}
