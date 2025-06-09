import { HttpClient } from "../../tools/httpClient";
import { toUser, toUsers, User } from "./user";

export class UserProvider {
    public static async getUsers(): Promise<User[]> {
        const response = await HttpClient.get("Users/Get/All");

        return toUsers(response);
    }

    public static async getUserByPhoneNumber(phoneNumber: string): Promise<User> {
        const response = await HttpClient.get("User/Phone", {phoneNumber});

        return toUser(response);

    }
}