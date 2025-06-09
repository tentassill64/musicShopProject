using musicShopProject.Model.Categories;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service
{
    public interface ICategoryService
    {
        Result AddCategory(CategoryBlank? categoryBlank);
        Category[] GetAllCategories();
        Result RemoveCategory(Guid categoryId);
    }
}
