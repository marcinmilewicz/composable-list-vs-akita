import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationNavComponent } from './components/pagination-nav/pagination-nav.component';


@NgModule({
    declarations: [PaginationNavComponent],
    imports: [CommonModule],
    exports: [PaginationNavComponent]
})
export class SharedPaginationModule {
}
