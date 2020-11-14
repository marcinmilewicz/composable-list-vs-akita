import { Component, VERSION } from "@angular/core";
import { Direction } from "./classes/sort-trigger.class";
import { PersonList } from "./person.list";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  data$ = this.list.dataSource;
  query: string;

  constructor(private list: PersonList) {}

  sort(event) {
    const params = event.target.value.split(" ");
    this.list.sort.sort(params[0], params[1] as Direction);
  }

  filter(query) {
    this.list.filter.filter("query", query);
  }

  page(page: number) {
    this.list.pagination.page(Number(page));
  }

  limit(event) {
    const limit = Number(event.target.value);
    this.list.pagination.limit(limit);
  }
}
