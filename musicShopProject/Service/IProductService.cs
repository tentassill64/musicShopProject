using musicShopProject.Model.Products;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service;

public interface IProductService
{
    Result AddProduct(ProductBlank blank, Guid requestedUserId);
    Result UpdateProduct(ProductBlank blank, Guid requestedUserId);
}
