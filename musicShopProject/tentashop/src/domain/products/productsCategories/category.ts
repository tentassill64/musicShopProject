
export class Category {
    constructor(
        public id: string,
        public name: string,
        public photo: string
    ) { }
}

export function mapToCategory(data: any): Category {
    return new Category(data.id, data.name, data.photo);
}

export function mapToCategories(data: any[]): Category[] {
    return data.map(mapToCategory);
}