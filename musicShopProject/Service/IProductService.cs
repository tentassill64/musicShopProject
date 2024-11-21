using musicShopProject.Model.Products;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service;

public interface IProductService
{
    Result AddProduct(ProductBlank blank, Guid requestedUserId);
    Product[] GetProducts(Guid? categoryId = null);
    Result UpdateProduct(ProductBlank blank, Guid requestedUserId);
    Product? GetProduct(Guid productId);
}
