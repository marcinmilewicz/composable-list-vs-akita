import { Injectable } from '@angular/core';
import { PaginationResponse } from '@datorama/akita';
import { People } from './people.model';
import { asyncScheduler, Observable, scheduled } from 'rxjs';
import {data} from './../../data'

@Injectable({ providedIn: 'root' })
export class PeopleService {
  get(params): Observable<PaginationResponse<People>> {
    return scheduled([data], asyncScheduler);
  }
}