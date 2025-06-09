
export class SiteLinks {
    static home = "home";
    static orders = "/orders";
    static clients = "/clients";
    static products = "/products";
    static map = "/map";
    static editProductTemplate = "/products/edit/:productid";
    static editProduct(productId: string) {
        return `/products/edit/${productId}`;
    }
    static add = "/products/add";

    static login = "/login";
}