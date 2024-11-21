import { HttpClient } from "../../tools/httpClient";
import { mapToResult, Result } from "../../tools/types/results";
import { mapToProduct, mapToProducts, Product } from "./product";
import { ProductBlank } from "./productBlank";

export class ProductProvider {
    public static async getProducts(categoryId?: string | null): Promise<Product[]> {
        const response = await HttpClient.get("Products/Get/All", { categoryId });

        return mapToProducts(response);
    }

    public static async getProduct(productId: string | null): Promise<Product | null> {
        const response = await HttpClient.get("Product/Get", { productId });

        if(response) {
            return mapToProduct(response);
        }
        
        return null;
    }

    public static async saveProduct(blank: ProductBlank): Promise<Result> {
        const response = await HttpClient.post("Product/Save", blank);

        return mapToResult(response);
    }
}