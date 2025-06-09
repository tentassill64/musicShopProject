import { Countries } from "./countries";

export class Manufacturer {
    constructor(
        public id: string,
        public name: string,
        public logo: string,
        public country : Countries
    ) { }
}

export function mapToManufacturer(data: any):Manufacturer {
    return new Manufacturer(data.id, data.name, data.logo, data.country)
}

export function mapToManufacturers(data:any[]): Manufacturer[] {
    return data.map(mapToManufacturer);
}