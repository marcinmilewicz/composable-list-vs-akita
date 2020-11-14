import { Injectable } from "@angular/core";
import { SortTrigger } from "./classes/sort-trigger.class";
import { PaginationTrigger } from "./classes/pagination-trigger.class";
import { FilterTrigger } from "./classes/filter-trigger.class";
import { combineLatest, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { data } from "./data";

import { orderBy } from "lodash-es";

interface FilterParams {
  query: string;
  gender: "F" | "M";
}

@Injectable()
export class PersonList {
  sort = new SortTrigger("id", "asc");
  pagination = new PaginationTrigger(1, 3);
  filter = new FilterTrigger<FilterParams>({
    query: "",
    gender: null
  });

  dataSource: Observable<any> = combineLatest(
    this.sort.connect(),
    this.pagination.connect(),
    this.filter.connect()
  ).pipe(
    map(params => ({ ...params[0], ...params[1], ...params[2] })),
    switchMap((queryParams: Object) => this.request(queryParams))
  );

  request(params: any) {
    let outputData = orderBy(data, params.field, params.dir);
    const filteredData = outputData.filter(item =>
      item.name.includes(params.query)
    );
    outputData = filteredData;
    outputData = outputData.slice(
      Math.floor((params.page - 1) * params.limit),
      Math.floor((params.page - 1) * params.limit + params.limit)
    );
    return of({
      items: outputData,
      limit: params.limit,
      page: params.page,
      total: filteredData.length
    });
  }
}
