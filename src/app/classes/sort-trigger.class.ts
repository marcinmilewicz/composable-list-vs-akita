import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

export type Direction = "asc" | "desc";

export interface SortParam {
  field: string;
  dir: Direction;
}

export class SortTrigger {
  trigger$: BehaviorSubject<SortParam>;

  constructor(field: string, dir: Direction) {
    this.trigger$ = new BehaviorSubject<SortParam>({
      field,
      dir
    });
  }

  sort(field: string, dir: Direction) {
    this.trigger$.next({
      field,
      dir
    });
  }

  connect() {
    return this.trigger$.asObservable();
  }
}
