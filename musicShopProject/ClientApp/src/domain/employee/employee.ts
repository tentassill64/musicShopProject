export class Employee {
    constructor(
        public id: string, 
        public email: string,
        public phoneNumber: string | null
    ) {

    } 
}

export function toEmployee(data: any): Employee {

    return new Employee(data.id, data.email, data.phoneNumber);
}

export function toEmployees(data: any[]): Employee[] {
    return data.map(toEmployee);
}