import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Person } from './people.model'

export interface PeopleState extends EntityState<Person> {
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'people'})
export class PeopleStore extends EntityStore<PeopleState> {
    constructor() {
        super();
    }
}
