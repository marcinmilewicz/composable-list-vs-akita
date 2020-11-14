import { BehaviorSubject } from "rxjs";

export class FilterTrigger<T> {
  trigger$: BehaviorSubject<T>;
  defaultParams: T;

  constructor(defaultParams: T) {
    this.defaultParams = defaultParams;
    this.trigger$ = new BehaviorSubject<T>(defaultParams);
  }

  filter(param: keyof T, value: any) {
    this.trigger$.next({
      ...this.trigger$.getValue(),
      [param]: value
    });
  }

  clear() {
    this.trigger$.next(this.defaultParams);
  }

  connect() {
    return this.trigger$.asObservable();
  }
}
