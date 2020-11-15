import * as faker from 'faker';
import { timer } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import { sortBy } from 'lodash-es';
import { Person } from './feature-people/state/people.model';
import { Company } from './feature-companies/state/companies.model';

const count = 96;
const people: Person[] = [];
const companies: Company[] = [];
const countries = ['Poland', 'Germany', 'Greece', 'Holland', 'Ireland'];

const createPeopleData = () => {
    for (let i = 0; i < count; i++) {
        people.push({
            id: faker.random.number(),
            name: faker.name.findName(),
            gender: ['M', 'K'][faker.random.number(1)]
        });
    }
}

const createCompaniesData = () => {
    for (let i = 0; i < count; i++) {
        companies.push({
            id: faker.random.number(),
            name: faker.name.findName(),
            account: faker.finance.account(),
            city: faker.address.city(),
            country: countries[faker.random.number(4)],
            product: faker.commerce.product()
        });
    }
}

createPeopleData();
createCompaniesData();


const getData = (params, entities) => {
    console.log('Fetching from server with params: ', params);
    const merged = { ...params };
    const offset = (merged.page - 1) * +merged.perPage;
    const filteredData = entities
        .filter(item => !params.query || item.name.toUpperCase().includes(params.query.toUpperCase()))
        .filter(item => !params.country || item.country === params.country)

    const sortingIndicators = merged.sortBy && merged.sortBy.split('-')
    const reverseIndicator = sortingIndicators.length === 2;
    const sorted = reverseIndicator ? sortBy(filteredData, sortingIndicators[1]).reverse() : sortBy(filteredData, merged.sortBy);
    const paginatedItems = sorted.slice(offset, offset + +merged.perPage);

    return {
        currentPage: merged.page,
        perPage: +merged.perPage,
        total: entities.length,
        lastPage: Math.ceil(entities.length / +merged.perPage),
        data: paginatedItems
    };
}

export const getPeople = (params) => timer(1).pipe(mapTo(getData(params, people)));
export const getCompanies = (params) => timer(1).pipe(mapTo(getData(params, companies)))
export const getCountries = () => timer(1).pipe(tap(() => console.info('Fetching countries')), mapTo(countries));
