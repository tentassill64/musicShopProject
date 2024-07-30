using musicShopProject.Model.Categories;
using musicShopProject.Service.Categories.Repository;
using musicShopProject.Tools.Extensions;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service.Categories;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public Result AddCategory(CategoryBlank categoryBlank, Guid requestedUserId)
    {
        categoryBlank.Id ??= Guid.NewGuid();
        return SaveCategory(categoryBlank, requestedUserId);
    }

    private Result SaveCategory(CategoryBlank categoryBlank, Guid requestedUserId) 
    {
        Result result = ValidateCategoryBlank(categoryBlank, out CategoryBlank.Validated validatedBlank);
        if (!result.IsSuccess) return Result.Fail(result.ErrorsAsString);

        _categoryRepository.SaveCategory(validatedBlank, requestedUserId);

        return Result.Success();
    }

    private Result ValidateCategoryBlank(CategoryBlank categoryBlank, out CategoryBlank.Validated validatedBlank)
    {
        validatedBlank = null!;

        if (categoryBlank.Id is not { } id) throw new Exception("id отсутствует");

        if (categoryBlank.Name.IsNullOrWhiteSpace()) return Result.Fail("Не указанно имя категории");

        validatedBlank = new CategoryBlank.Validated(id, categoryBlank.Name!);

        return Result.Success();
    }


    public Category[] GetAllCategories()
    {
        return _categoryRepository.GetAllCategories();
    }
}
