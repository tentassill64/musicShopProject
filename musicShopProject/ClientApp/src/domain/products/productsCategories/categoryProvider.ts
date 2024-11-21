import { common } from "@mui/material/colors";
import { Category, mapToCategories } from "./category";
import { HttpClient } from "../../../tools/httpClient";

export class CategoryProvider {
    public static async getCategories(): Promise<Category[]> {
        const response = await HttpClient.get("Category/Get/All");

        return mapToCategories(response);
    }
}