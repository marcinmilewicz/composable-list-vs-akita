import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "pages"
})
export class PagesPipe implements PipeTransform {
  transform(data: any): any {
    const pagesCount = Math.ceil(data.total / data.limit);
    const pages = Array(pagesCount)
      .fill("")
      .map((item, index) => index + 1 );
    return pages;
  }
}
