import { HttpClient } from "../../tools/httpClient";
import { DataResult } from "../../tools/types/dataResult";
import { mapToResult, Result } from "../../tools/types/results";
import { toUser, toUsers, User } from "./user";
import { UserBlank } from "./userBlank";

export class UserProvider {

    public static async login(phoneNumber: string, password: string): Promise<DataResult<User>>{
        const response = await HttpClient.post("login", {phoneNumber, password})
        const resultData : Result = response.result;
            
            if (!resultData?.isSuccess && resultData.errors) {
                return DataResult.fail(resultData.errors[0]);
            }

            const user = toUser(response.data);
            return DataResult.success(user);
    }

    public static async register(blank: UserBlank) : Promise<Result>{
        const response = await HttpClient.post("register", blank)

        return mapToResult(response)
    }

    public static async getUsers(): Promise<User[]> {
        const response = await HttpClient.get("Users/Get/All");

        return toUsers(response);
    }

    public static async getUserByPhoneNumber(phoneNumber: string): Promise<User> {
        const response = await HttpClient.get("User/Phone", {phoneNumber});

        return toUser(response);

    }
}