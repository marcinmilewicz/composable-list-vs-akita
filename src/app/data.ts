import * as faker from 'faker';
import { timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { sortBy } from 'lodash-es';

const count = 96;
const people = [];

for (let i = 0; i < count; i++) {
    people.push({
        id: faker.random.number(),
        name: faker.name.findName(),
        gender: ["M", "K"][faker.random.number(1)]
    });
}

export function getData(params) {
    console.log('Fetching from server with params: ', params);
    const merged = {...params};
    const offset = (merged.page - 1) * +merged.perPage;
    const filteredPeople = people.filter(person => !params.query || person.name.includes(params.query))

    const sorted = sortBy(filteredPeople, merged.sortBy);
    const paginatedItems = sorted.slice(offset, offset + +merged.perPage);

    return {
        currentPage: merged.page,
        perPage: +merged.perPage,
        total: people.length,
        lastPage: Math.ceil(people.length / +merged.perPage),
        data: paginatedItems
    };
}

export const getPeople = function (params) {
    return timer(1).pipe(mapTo(getData(params)));
};

