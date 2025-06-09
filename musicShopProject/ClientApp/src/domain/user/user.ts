export class User {
    constructor(
        public id: string,
        public phoneNumber: string,
        public email: string | null
    ) { }
}

export function toUser(data: any): User {
    return new User(data.id, data.phoneNumber, data.email);
}

export function toUsers(data: any[]): User[] {
    return data.map(toUser);
}