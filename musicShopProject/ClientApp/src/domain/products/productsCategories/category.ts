
export class Category {
    constructor(
        public id: string,
        public name: string
    ) { }
}

export function mapToCategory(data: any): Category {
    return new Category(data.id, data.name);
}

export function mapToCategories(data: any[]): Category[] {
    return data.map(mapToCategory);
}