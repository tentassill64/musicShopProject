import { Countries } from "./countries";
import { Manufacturer } from "./manufactured";

export interface ManufactorBlank{
    id: string | null,
    name: string | null,
    logo: string | null,
    country: Countries | null
}

export namespace ManufactorBlank {
    export function getEmpty(): ManufactorBlank {
        return {
            id: null,
            name: null,
            logo: null,
            country: null
        };
    }

    export function toProductBlank(category: Manufacturer): ManufactorBlank {
        return {
            id: category.id,
            name: category.name,
            logo: category.logo,
            country: category.country
        };
    }
 }