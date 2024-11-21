import { PrettyDOMOptions } from "@testing-library/react";
import { ProductStatus } from "./enum/ProductStatus";

export class Product {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public manufacturer: string,
        public status: ProductStatus,
        public price: number,
        public weight: number,
        public categoryId: string,
        public isHidden: boolean,
        public quantity: number,
        public images: string[]
    ) { }
}

export function mapToProduct(data: any):Product {
    return new Product(data.id, data.name, data.description, data.manufacturer,
        data.status, data.price, data.weight, data.categoryId,
        data.isHidden, data.quantity, data.images
    )
}

export function mapToProducts(data:any[]): Product[] {
    return data.map(mapToProduct);
}