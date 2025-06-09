using musicShopProject.Model.Manufacturers;
using musicShopProject.Model.Products;
using musicShopProject.Service.Products.Repository.Models;

namespace musicShopProject.Service.Products.Repository.Converters
{
    public static class ProductConverter
    {
        public static Product ToProduct(this ProductDB db, Manufacturer manufacturer)
        {
            return new Product(db.Id, db.Name, db.Description, db.Status, manufacturer, db.Price, db.Weight, db.CategoryId, db.IsHidden, db.Quantity, db.Images);
        }
    }
}
