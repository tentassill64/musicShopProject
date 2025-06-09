import { OrderState } from "./enum/orderState";
import { Order } from "./order";
import { OrderItemBlank } from "./orderItemBLank";

export interface OrderBlank{
    id: string | null,
    price: number | null,
    clientPhoneNumber : string | null,
    ClientId : string | null,
    AddressId : string | null,
    CompletedDateTimeUtc: Date | null,
    CreatedDateTimeUtc: Date | null,
    State: OrderState | null,
    OrderNumber: number | null,
    OrderItems: OrderItemBlank[] | []
}

export namespace OrderBlank {
    export function getEmpty(): OrderBlank {
        return {
                id:  null,
                price:  null,
                clientPhoneNumber : null,
                ClientId :  null,
                AddressId : null,
                CompletedDateTimeUtc: null,
                CreatedDateTimeUtc:  null,
                State: null,
                OrderNumber: null,
                OrderItems:  []
        };
    }

    export function toProductBlank(order: Order): OrderBlank {
        return {
            id: order.id,
            price:  order.price,
            clientPhoneNumber : order.clientPhoneNumber,
            ClientId :  order.client.id,
            AddressId : order.address.id,
            CompletedDateTimeUtc: order.completedDateTimeUtc,
            CreatedDateTimeUtc:  order.createdDateTimeUtc,
            State: order.state,
            OrderNumber: order.orderNumber,
            OrderItems:  []
        };
    }
 }