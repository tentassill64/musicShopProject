import { OverridesStyleRules } from "@mui/material/styles/overrides";
import { HttpClient } from "../../tools/httpClient";
import { PagedResult } from "../../tools/types/pagedResult";
import { mapToOrder, mapToOrders, Order } from "./order";
import { OrderState } from "./enum/orderState";
import { mapToResult, Result } from "../../tools/types/results";
import { OrderBlank } from "./orderBLank";
import { AddressBlank } from "../address/addressBlank";


export class OrderProvider {

    static async saveOrder(orderBlank : OrderBlank): Promise<Result> {
        const response = await HttpClient.post("order/save", orderBlank)
        return mapToResult(response)
    }

    static async saveAddress(adressBlank: AddressBlank): Promise<Result>{
        const response = await HttpClient.post("order/saveAddress", adressBlank)
        return mapToResult(response)
    }

    static async getOrderPage(page: number, pageSize: number): Promise<PagedResult<Order>> {
        const response = await HttpClient.get("Get/Page", {page, pageSize});

        const totalRows = response.totalRows;
        const values =  mapToOrders((response.values as Order[]));

        return new PagedResult(values, totalRows);
    } 

    static async changeState(state: OrderState, orderId: string): Promise<Result> {
        const response = await HttpClient.post("Order/Change/State", {state, orderId});

        return mapToResult(response);
    }

    static async getOrderByUser(userId: string) : Promise<Order[]>{
        const response = await HttpClient.get("user/oders", {userId})

        return mapToOrders(response)
    }
}