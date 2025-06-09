import { User } from "./user";

export interface UserBlank{
    id: string | null,
    phoneNumber: string | null,
    password: string | null,
    PasswordBeChanged: boolean | null
}

export namespace UserBlank {
    export function getEmpty(): UserBlank {
        return {
            id: null,
            phoneNumber: null,
            password: null,
            PasswordBeChanged: null
        };
    }

    export function toUserBLank(user: User): UserBlank {
        return {
            id: user.id,
            phoneNumber: user.phoneNumber,
            password: null,
            PasswordBeChanged: false
        };
    }
 }
