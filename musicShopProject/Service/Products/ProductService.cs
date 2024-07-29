using musicShopProject.Model.Products;
using musicShopProject.Service.Products.Repository;
using musicShopProject.Tools.Extensions;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service.Products;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IImageService _imageService;

    public ProductService(IProductRepository productRepository, IImageService imageService)
    {
        _productRepository = productRepository;
        _imageService = imageService;
    }

    public Result AddProduct(ProductBlank blank, Guid requestedUserId)
    {
        blank.Id ??= Guid.NewGuid();
        return SaveProduct(blank, requestedUserId);
    }

    private Result SaveProduct(ProductBlank blank, Guid requestedUserId)
    {
        Result validateResult = ValidateProductBlank(blank, out ProductBlank.Validated validatedProduct);
        if (!validateResult.IsSuccess) return Result.Fail(validateResult.Errors);

        _productRepository.SaveProduct(validatedProduct);

        return Result.Success();
    }

    private Result ValidateProductBlank(ProductBlank blank, out ProductBlank.Validated validatedProduct)
    {
        validatedProduct = null!;

        if (blank.Id is not {} id) throw new Exception("id продукта пуст");

        if (blank.Name.IsNullOrWhiteSpace()) return Result.Fail("Укажите название товара");
        if (blank.CategoryId is not {} categoryId) return Result.Fail("Укажите категорию товара");
        if (blank.Description.IsNullOrWhiteSpace()) return Result.Fail("Укажите описание товара");

        if (blank.Price is not {} price) return Result.Fail("Укажите цену");
        if (price <= 0) return Result.Fail("Цена не может быть меньше или равна 0");

        if (blank.Weight is not { } weight) return Result.Fail("Укажите вес");
        if (weight <= 0) return Result.Fail("Вес не может быть меньше или равен 0");

        if (blank.Images.Length < 0) return Result.Fail("Добавьте фотографии");

        if (blank.Manufacturer.IsNullOrWhiteSpace()) return Result.Fail("Укажите производителя");

        if (blank.Quantity is not { } quantity) return Result.Fail("Укажите количество");
        if (quantity < 0) return Result.Fail("Количество не может быть меньше 0");

        if (blank.Status is not { } status) return Result.Fail("Укажите статус");

        if (blank.IsHidden is not { } isHidden) return Result.Fail("Укажите видимость");
        //TOASK
        _imageService.Save(blank.Images, out String[] imagesPaths);
        blank.Images = imagesPaths;

        validatedProduct = new ProductBlank.Validated(
            id, blank.Name!, blank.Description!, price,
            categoryId, weight, blank.Manufacturer!, quantity,
            blank.Images!, status, isHidden
        );

        return Result.Success();
    }

    public Result UpdateProduct(ProductBlank blank, Guid requestedUserId)
    {
        return SaveProduct(blank, requestedUserId);
    }
}
