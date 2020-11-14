import { inject, InjectionToken } from '@angular/core';
import { PeopleQuery } from './state/people.query';
import { PaginatorPlugin } from '@datorama/akita';

export const PEOPLE_PAGINATOR = new InjectionToken('CONTACTS_PAGINATOR', {
    providedIn: 'root',
    factory: () => {
        const peopleQuery = inject(PeopleQuery);
        return new PaginatorPlugin(peopleQuery).withControls().withRange();
    }
});
