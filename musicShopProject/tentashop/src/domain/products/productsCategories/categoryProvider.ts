import { common } from "@mui/material/colors";
import { Category, mapToCategories } from "./category";
import { HttpClient } from "../../../tools/httpClient";
import { mapToResult, Result } from "../../../tools/types/results";

export class CategoryProvider {
    public static async getCategories(): Promise<Category[]> {
        const response = await HttpClient.get("Category/Get/All");

        return mapToCategories(response);
    }

    public static async removeCategory(categoryId: string): Promise<Result> {
        const response = await HttpClient.post("Category/Delete", categoryId)

        return mapToResult(response);
    }
}