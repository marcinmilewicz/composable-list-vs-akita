import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PeopleStore, PeopleState } from './people.store';

@Injectable({
    providedIn: 'root',
})
export class PeopleQuery extends QueryEntity<PeopleState> {
    constructor(protected store: PeopleStore) {
        super(store);
    }
}
