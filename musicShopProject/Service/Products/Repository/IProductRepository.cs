using musicShopProject.Model.Products;

namespace musicShopProject.Service.Products.Repository
{
    public interface IProductRepository
    {
        void SaveProduct(ProductBlank.Validated blank, Guid requestedUserId);
        Product[] GetProducts(Guid? categoryId = null);
        Product? GetProduct(Guid productId);
    }
}
