import { Result } from "./results";

export class DataResult<T>{
    constructor(
       public result: Result,
       public data: T | null
    ){}
    
    static fail<T>(error: string): DataResult<T> {
        return new DataResult<T>(Result.fail([error]), null);
    }

    static success<T>(data: T): DataResult<T> {
        return new DataResult<T>(Result.success(), data);
    }
}