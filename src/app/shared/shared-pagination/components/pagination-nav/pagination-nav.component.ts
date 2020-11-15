import { Component, Input, OnInit } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';

@Component({
    selector: 'app-pagination-nav',
    templateUrl: './pagination-nav.component.html',
    styleUrls: ['./pagination-nav.component.css'],
})
export class PaginationNavComponent<T> implements OnInit {
    @Input() paginatorRef: PaginatorPlugin<T> = null;
    @Input() controls: number[] = [];

    constructor() {}

    ngOnInit() {
        if (!this.paginatorRef) {
            throw new Error('PaginationRef must be specified.');
        }
    }
}
