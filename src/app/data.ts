import * as faker from 'faker';
import { timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { sortBy } from 'lodash-es';

export const data = [
  {
    id: 1,
    name: "Bernard",
    gender: "M"
  },
  {
    id: 2,
    name: "Roger",
    gender: "M"
  },
  {
    id: 3,
    name: "Darleene",
    gender: "F"
  },
  {
    id: 4,
    name: "Alfred",
    gender: "M"
  },
  {
    id: 5,
    name: "Cecille",
    gender: "F"
  },
  {
    id: 6,
    name: "Alice",
    gender: "F"
  },
  {
    id: 7,
    name: "Elliot",
    gender: "M"
  },
  {
    id: 8,
    name: 'Andrew',
    gender: 'M'
  },
  {
    id: 9,
    name: 'Gertrude',
    gender: 'F'
  }
];

const count = 96;
const people = [];

for (let i = 0; i < count; i++) {
  people.push({
    id: faker.random.number(),
    name: faker.name.findName(),
    gender: ["M","K"][faker.random.number(1)]
  });
}

export function getData(params) {
  console.log('Fetching from server with params: ', params);
  const merged = {  ...params };
  const offset = (merged.page - 1) * +merged.perPage;
  const filteredPeople = people.filter(person=>person.name.includes(params.query))
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

export const getPeople = function(params) {
  return timer(1).pipe(mapTo(getData(params)));
};

