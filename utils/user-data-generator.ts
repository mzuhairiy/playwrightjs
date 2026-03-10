import { faker } from '@faker-js/faker';

export interface UserCheckoutData {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    address1: string;
    address2: string;
    city: string;
    postcode: string;
}

export interface UserCreds {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export function generateUserCheckoutData(): UserCheckoutData {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        address1: faker.location.streetAddress(),
        address2: faker.location.streetAddress(),
        city: faker.location.city(),
        postcode: faker.finance.routingNumber()
    };
}

export function generateUserCreds(): UserCreds {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: "admin1234"
    };
}
