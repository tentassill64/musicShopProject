import { Address, toAddress } from "../address/address";
import { toUser, User } from "../user/user";
import { OrderState } from "./enum/orderState";

export class Order {
    constructor(
        public id: string,
        public price: number,
        public clientPhoneNumber: string,
        public client: User,
        public address: Address,
        public completedDateTimeUtc: Date | null,
        public createdDateTimeUtc: Date, 
        public state: OrderState,
        public orderNumber: number
    ) { }
}

export function mapToOrder(data: any): Order {
    const client = toUser(data.client);
    const address = toAddress(data.address);
    const completedDateTime = new Date(data.completedDateTimeUtc)
    const createdDateTime = new Date(data.createdDateTimeUtc);

    return new Order(data.id, data.price, data.clientPhoneNumber, client, address, completedDateTime, createdDateTime, data.state, data.orderNumber);
}

export function mapToOrders(data: any[]): Order[] {
    return data.map(order => mapToOrder(order));
}