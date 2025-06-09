import { HttpClient } from "../../tools/httpClient";
import { mapToResult, Result } from "../../tools/types/results";
import { Employee, toEmployee } from "./employee";

export class EmployeeProvider {

    public static async employeeLogin(email: string, password: string): Promise<Result> {
            const response = await HttpClient.post("Employee/Login" , {email, password});
    
            return mapToResult(response);
    }

    public static async getEmployee(email: string, password: string): Promise<Employee> {
        const response = await HttpClient.get("Employee/Get", {email, password});

        return toEmployee(response);
    }
}