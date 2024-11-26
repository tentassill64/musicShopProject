import { Address, toAddress } from "../address/address";
import { toUser, User } from "../user/user";
import { OrderState } from "./enum/orderState";
import { mapToOrderItems, OrderItem } from "./orderItem";

export class Order {
    constructor(
        public id: string,
        public price: number,
        public clientPhoneNumber: string,
        public client: User,
        public address: Address,
        public orderItems: OrderItem[],
        public completedDateTimeUtc: Date | null,
        public createdDateTimeUtc: Date, 
        public state: OrderState,
        public orderNumber: number
    ) { }
}

export function mapToOrder(data: any): Order {
    const client = toUser(data.client);
    const address = toAddress(data.address);
    let completedDateTime: Date | null;
    if(data.completedDateTimeUtc) completedDateTime = new Date(data.completedDateTimeUtc);
    else completedDateTime = null;
    const createdDateTime = new Date(data.createdDateTimeUtc);
    const orderItems = mapToOrderItems(data.orderItems);

    return new Order(data.id, data.price, data.clientPhoneNumber, client, address, orderItems, completedDateTime, createdDateTime, data.state, data.orderNumber);
}

export function mapToOrders(data: any[]): Order[] {
    return data.map(order => mapToOrder(order));
}