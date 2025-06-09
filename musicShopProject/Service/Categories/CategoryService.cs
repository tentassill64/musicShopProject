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

    public Result AddCategory(CategoryBlank? categoryBlank)
    {
        categoryBlank.Id ??= Guid.NewGuid();
        categoryBlank.CreatedUserId ??= Guid.NewGuid();
        return SaveCategory(categoryBlank);
    }

    private Result SaveCategory(CategoryBlank categoryBlank)
    {
        Result result = ValidateCategoryBlank(categoryBlank, out CategoryBlank.Validated validatedBlank);
        if (!result.IsSuccess) return Result.Fail(result.ErrorsAsString);

        _categoryRepository.SaveCategory(validatedBlank);

        return Result.Success();
    }

    private Result ValidateCategoryBlank(CategoryBlank categoryBlank, out CategoryBlank.Validated validatedBlank)
    {
        validatedBlank = null!;

        if (categoryBlank.Id is not { } id) throw new Exception("id отсутствует");

        if (categoryBlank.Name is not { } name) throw new Exception("Name пришло null");

        if (name.IsNullOrWhiteSpace()) return Result.Fail("Не указанно имя категории");

        if (categoryBlank.Photo is not { } photo) throw new Exception("Photo пришло null");

        if (photo.IsNullOrWhiteSpace()) return Result.Fail("Ссылка на изображения обязательна");

        if (photo.IsUrlValid()) return Result.Fail("Ссылка на изображение не корректна");

        if (categoryBlank.CreatedUserId is not { } createrId) throw new Exception("Id создателя пришел Null");

        validatedBlank = new CategoryBlank.Validated(id, name, photo, createrId, categoryBlank.ModifiedUserId);

        return Result.Success();
    }


    public Category[] GetAllCategories()
    {
        return _categoryRepository.GetAllCategories();
    }

    public Result RemoveCategory(Guid categoryId)
    {
        _categoryRepository.RemoveCategory(categoryId);

        return Result.Success();
    }
}
