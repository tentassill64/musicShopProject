import { OrderItem } from "./orderItem";

export interface OrderItemBlank{
    id: string | null,
    OrderId: string | null,
    ProductId : string | null,
    ProductPrice : number | null,
    ProductCategoryId : string | null
}

export namespace ProductBlank {
    export function getEmpty(): OrderItemBlank {
        return {
            id: null,
            OrderId: null,
            ProductId :  null,
            ProductPrice : null,
            ProductCategoryId : null
        };
    }

    export function toProductBlank(orderItem: OrderItem): OrderItemBlank {
        return {
            id: orderItem.id,
            OrderId: orderItem.orderId,
            ProductId : orderItem.product.id,
            ProductPrice : orderItem.productPrice,
            ProductCategoryId : orderItem.productCategoryId
        };
    }
 }