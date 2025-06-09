import { Address } from "./address";

export interface AddressBlank{
         id: string | null,
         city: string | null,
         street: string | null,
         home: string | null,
         apartment: string | null,
}

export namespace AddressBlank {
    export function getEmpty(addresId: string): AddressBlank {
        return {
             id: addresId,
         city: null,
         street: null,
         home: null,
         apartment: null,
        };
    }

    export function toProductBlank(address: Address): AddressBlank {
        return {
            id: address.id,
         city: address.city,
         street: address.street,
         home: address.home,
         apartment: address.apartment,
        };
    }
 }