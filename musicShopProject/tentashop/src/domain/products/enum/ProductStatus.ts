import { stat } from "fs";

export enum ProductStatus {
    OnSale = 1,
    ToOrder = 2,
    OutOfStock = 3
}

export namespace ProductStatus {
    export function getDisplayName(status: ProductStatus):string {
        switch(status) {
            case ProductStatus.OnSale: return "В наличии";
            case ProductStatus.ToOrder: return "На заказ";
            case ProductStatus.OutOfStock: return "Закончился";
            default: return "Неизвестно";
        }
    }

    export function getArray(): ProductStatus[] {
        return [ProductStatus.OnSale, ProductStatus.OutOfStock, ProductStatus.OutOfStock];
    }
}