import { OverridesStyleRules } from "@mui/material/styles/overrides";
import { HttpClient } from "../../tools/httpClient";
import { PagedResult } from "../../tools/types/pagedResult";
import { mapToOrder, mapToOrders, Order } from "./order";
import { OrderState } from "./enum/orderState";
import { mapToResult, Result } from "../../tools/types/results";

export class OrderProvider {

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
}