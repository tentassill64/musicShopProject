using musicShopProject.Model.Products;
using musicShopProject.Service.Products.Repository.Models;

namespace musicShopProject.Service.Products.Repository.Converters
{
    public static class ProductConverter
    {
        public static Product ToProduct(this ProductDB db)
        {
            return new Product(db.Id, db.Name, db.Description, db.Status, db.Manufacturer, db.Price, db.Weight, db.CategoryId, db.IsHidden, db.Quantity, db.Images);
        }
    }
}
