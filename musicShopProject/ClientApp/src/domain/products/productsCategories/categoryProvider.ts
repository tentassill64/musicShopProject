import { common } from "@mui/material/colors";
import { Category, mapToCategories } from "./category";
import { HttpClient } from "../../../tools/httpClient";
import { CategoryBlank } from "./categoryBlank";
import { mapToResult, Result } from "../../../tools/types/results";

export class CategoryProvider {
    public static async getCategories(): Promise<Category[]> {
        const response = await HttpClient.get("Category/Get/All");

        return mapToCategories(response);
    }

    public static async saveCategory(category: CategoryBlank): Promise<Result> {
        const response = await HttpClient.post("category/save", category);

        return mapToResult(response);
    }

    public static async removeCategory(categoryId: string): Promise<Result> {
        const response = await HttpClient.post(`Category/Delete?categoryId=${categoryId}`)

        return mapToResult(response);
    }
}