using musicShopProject.Model.product;
using musicShopProject.Service.Products.Repository.Models;
using System.Runtime.CompilerServices;

namespace musicShopProject.Service.Products.Repository.Converters
{
    public static class ProductConverter
    {
        public static Product ToProduct(this ProductDB db)
        {
            return new Product(db.Id, db.Name, db.Description, db.Status, db.Price, db.Weight, db.Category);
        }
    }
}
