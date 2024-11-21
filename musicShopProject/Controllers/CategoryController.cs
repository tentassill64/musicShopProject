using Microsoft.AspNetCore.Mvc;
using musicShopProject.Model.Categories;
using musicShopProject.Service;
using musicShopProject.Tools.Types;

namespace musicShopProject.Controllers;

public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;
    public CategoryController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpPost("category/save")]
    public Result AddCategory([FromBody] CategoryBlank categoryBlank, Guid requestedUserId)
    {
        return _categoryService.AddCategory(categoryBlank, requestedUserId);
    }

    [HttpGet("Category/Get/All")]
    public Category[] GetAllCategories()
    {
        return _categoryService.GetAllCategories();
    }
}
