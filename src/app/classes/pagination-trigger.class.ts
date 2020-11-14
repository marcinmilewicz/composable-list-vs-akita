import { BehaviorSubject } from "rxjs";

interface PaginationParams {
  page: number;
  limit: number;
}

export class PaginationTrigger {
  trigger$: BehaviorSubject<PaginationParams>;
  defaultParams: PaginationParams;

  constructor(page: number = 1, limit: number = 10) {
    this.defaultParams = { page, limit };
    this.trigger$ = new BehaviorSubject<PaginationParams>({ page, limit });
  }

  limit(limit: number) {
    this.trigger$.next({
      ...this.trigger$.getValue(),
      limit
    });
  }

  page(page: number) {
    this.trigger$.next({
      ...this.trigger$.getValue(),
      page
    });
  }

  reset() {
    this.trigger$.next(this.defaultParams);
  }

  connect() {
    return this.trigger$.asObservable();
  }
}
