import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CompaniesService } from '../state/companies.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompanyListResolver implements Resolve<string[]> {
    constructor(private companiesService: CompaniesService) {}

    resolve(): Observable<string[]> {
        return this.companiesService.fetchCountries();
    }
}
