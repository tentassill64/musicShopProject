
import Chip from '@mui/material/Chip';
import { Component } from 'react';

export enum OrderState {
    Ordered = 1,
    Canceled = 2,
    OnDelivery = 3,
    Completed = 4
}

export namespace OrderState {
   export function getDisplayName(state: OrderState):string {
        switch(state) {
            case OrderState.Ordered:  return "Заказан"
            case OrderState.Canceled: return "Отменён"
            case OrderState.OnDelivery: return "Дожидается доставки"
            case OrderState.Completed: return "Завершен"
        }
    }
}