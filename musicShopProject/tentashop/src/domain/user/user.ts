export class User {
    constructor(
        public id: string,
        public phoneNumber: string,
        public email: string | null,
        public birthDate: Date | null
    ) { }
}



export function toUser(data: any): User {

    let birthDate:Date | null;

    if(data.birthDate) birthDate = new Date(data.birthDate);
    else birthDate = null;

    return new User(data.id, data.phoneNumber, data.email, birthDate);
}

export function toUsers(data: any[]): User[] {
    return data.map(toUser);
}