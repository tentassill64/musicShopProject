import { stat } from "fs";

export enum ProductStatus {
    OnSale = 1,
    TemporarilyOutOfSale = 2,
    OutOfStock = 3
}

export namespace ProductStatus {
    export function getDisplayName(status: ProductStatus):string {
        switch(status) {
            case ProductStatus.OnSale: return "В продаже";
            case ProductStatus.TemporarilyOutOfSale: return "Убран с продажи";
            case ProductStatus.OutOfStock: return "Закончился";
            default: return "Неизвестно";
        }
    }

    export function getArray(): ProductStatus[] {
        return [ProductStatus.OnSale, ProductStatus.OutOfStock, ProductStatus.OutOfStock];
    }
}