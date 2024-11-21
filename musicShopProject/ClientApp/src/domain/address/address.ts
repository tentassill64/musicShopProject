export class Address {
    constructor(
        public id: string,
        public city: string,
        public street: string,
        public home: string,
        public apartment: string,
        
    ) { }
}

export function toAddress(data: any): Address {
    return new Address(data.id, data.city, data.street, data.home, data.apartment);
}

export function toAddresses(data: any[]):Address[] {
    return data.map(toAddress);
}