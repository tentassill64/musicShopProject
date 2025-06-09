using musicShopProject.Model.Categories;
using musicShopProject.Service.Categories.Repository.Models;

namespace musicShopProject.Service.Categories.Repository.Converters;

public static class CategoryConverter
{
    public static Category ToCategory(this CategoryDB db)
    {
        return new Category(db.Id, db.Name, db.Photo, db.CreatedUserId, db.ModifiedUserId);
    }
}
