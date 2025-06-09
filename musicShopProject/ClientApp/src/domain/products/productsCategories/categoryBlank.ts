import { Category } from "./category";

export interface CategoryBlank{
    id: string | null,
    name: string | null,
    photo: string | null
}

export namespace CategoryBlank {
    export function getEmpty(): CategoryBlank {
        return {
            id: null,
            name: null,
            photo: null
        };
    }

    export function toProductBlank(category: Category): CategoryBlank {
        return {
            id: category.id,
            name: category.name,
            photo: category.photo
        };
    }
 }