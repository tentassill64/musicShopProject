import { Countries } from "./countries";
import { Manufacturer } from "./manufactured";

export interface ManufacturerBlank{
    id: string | null,
    name: string | null,
    logo: string | null,
    country: Countries | null
}

export namespace ManufacturerBlank {
    export function getEmpty(): ManufacturerBlank {
        return {
            id: null,
            name: null,
            logo: null,
            country: null
        };
    }

    export function toProductBlank(category: Manufacturer): ManufacturerBlank {
        return {
            id: category.id,
            name: category.name,
            logo: category.logo,
            country: category.country
        };
    }
 }