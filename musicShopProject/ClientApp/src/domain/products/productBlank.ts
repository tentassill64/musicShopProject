import { Manufacturer } from "../manufactures/manufactured";
import { ProductStatus } from "./enum/ProductStatus";
import { Product } from "./product";

export interface ProductBlank{
    id: string | null,
    name: string | null,
    description: string | null,
    manufacturer: Manufacturer | null,
    status: ProductStatus,
    price: number, 
    weight: number,
    categoryId: string | null,
    isHidden: boolean,
    quantity: number,
    images: string[]
}

export namespace ProductBlank {
    export function getEmpty(): ProductBlank {
        return {
            id: null,
            name: null,
            description: null,
            manufacturer: null,
            status: ProductStatus.TemporarilyOutOfSale,
            price: 1,
            weight: 1,
            categoryId: null,
            isHidden: true,
            quantity: 0,
            images: []
        };
    }

    export function toProductBlank(product: Product): ProductBlank {
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            manufacturer: product.manufacturer,
            categoryId: product.categoryId,
            isHidden: product.isHidden,
            images: product.images,
            price: product.price,
            quantity: product.quantity,
            status: product.status,
            weight: product.weight
        };
    }
 }