import { mapToProduct, Product } from "../products/product";

export class OrderItem {
    constructor(
        public id: string,
        public orderId: string,
        public product: Product,
        public productPrice: number,
        public productCategoryId: string
    ) { }
}

export function mapToOrderItem(data: any): OrderItem {
    const product = mapToProduct(data.product);

    return new OrderItem(data.id, data.orderId, product, data.productPrice, data.productCategoryId);
}

export function mapToOrderItems(data: any[]): OrderItem[] {
    return data.map(mapToOrderItem);
}
