import * as faker from 'faker';
import { timer } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import { sortBy } from 'lodash-es';
import { Person } from './feature-people/state/people.model';
import { Company } from './feature-companies/state/companies.model';

const count = 96;
const people: Person[] = [];
const countries = ['Poland', 'Germany', 'Greece', 'Holland', 'Ireland'];
let companies: Company[] = [];

const createPeopleData = () => {
    for (let i = 0; i < count; i++) {
        people.push({
            id: faker.random.number(),
            name: faker.name.findName(),
            gender: ['M', 'K'][faker.random.number(1)],
        });
    }
};

const createCompany = () => ({
    id: faker.random.number(),
    name: faker.name.findName(),
    account: faker.finance.account(),
    city: faker.address.city(),
    country: countries[faker.random.number(4)],
    product: faker.commerce.product(),
});

const createCompaniesData = () => {
    for (let i = 0; i < count; i++) {
        companies.push(createCompany());
    }
};

createPeopleData();
createCompaniesData();

const getDataForPage = <T>(page, params, entities) => {
    const offset = (page - 1) * +params.perPage;
    const filteredData = entities
        .filter((item) => !params.query || item.name.toUpperCase().includes(params.query.toUpperCase()))
        .filter((item) => !params.country || item.country === params.country);

    const sortingIndicators = params.sortBy && params.sortBy.split('-');
    const reverseIndicator = sortingIndicators.length === 2;
    const sorted = reverseIndicator ? sortBy(filteredData, sortingIndicators[1]).reverse() : sortBy(filteredData, params.sortBy);
    let paginatedItems = sorted.slice(offset, offset + +params.perPage);

    return {
        currentPage: page,
        perPage: +params.perPage,
        total: filteredData.length,
        lastPage: Math.ceil(filteredData.length / +params.perPage),
        data: paginatedItems,
    };
};

const getData = (params, entities) => {
    console.log('Fetching from server with params: ', params);
    const merged = { ...params };
    let result = getDataForPage(merged.page, merged, entities);

    if (!result.data.length) {
        result = getDataForPage(1, merged, entities);
    }

    return result;
};

const dueTime = 1;

export const getPeople = (params) => timer(dueTime).pipe(mapTo(getData(params, people)));
export const getCompanies = (params) => timer(dueTime).pipe(mapTo(getData(params, companies)));
export const getCountries = () =>
    timer(dueTime).pipe(
        tap(() => console.info('Fetching countries')),
        mapTo(countries)
    );

export const addCompany = () => {
    const company = createCompany();
    return timer(dueTime).pipe(
        tap(() => companies.push(company)),
        mapTo({ id: company.id })
    );
};

export const updateCompany = (id: number) => {
    let index = companies.findIndex((company) => company.id === id);
    const company = { ...createCompany(), id };
    companies[index] = company;
    return timer(dueTime).pipe(mapTo({ id: company.id }));
};
