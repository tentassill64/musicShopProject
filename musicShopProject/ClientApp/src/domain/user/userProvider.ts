import { HttpClient } from "../../tools/httpClient";
import { toUsers, User } from "./user";

export class UserProvider {
    public static async getUsers(): Promise<User[]> {
        const response = await HttpClient.get("Users/Get/All");

        return toUsers(response);
    }
}