using musicShopProject.Model.Categories;

namespace musicShopProject.Service.Categories.Repository;

public interface ICategoryRepository
{
    void SaveCategory(CategoryBlank.Validated validatedBlank, Guid requestedUserId);
    Category[] GetAllCategories();
}
