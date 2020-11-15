import { Injectable } from '@angular/core';
import { PaginationResponse } from '@datorama/akita';
import { Person } from './people.model';
import { Observable } from 'rxjs';
import { getPeople } from '../../data'

@Injectable({ providedIn: 'root' })
export class PeopleService {
    get(params): Observable<PaginationResponse<Person>> {
        return getPeople(params);
    }
}
