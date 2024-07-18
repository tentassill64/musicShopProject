using musicShopProject.Model.Products;
using musicShopProject.Service.Products.Repository;
using musicShopProject.Tools.Extensions;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service.Products;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public Result AddProduct(ProductBlank blank)
    {
        Result validateResult = ValidateProductBlank(blank, out ProductBlank.Validated validatedProduct);
        if (!validateResult.IsSuccess) return Result.Fail(validateResult.Errors);

        _productRepository.SaveProduct(validatedProduct);

        return Result.Success();
    }

    public Result UpdateProduct()
    {
        throw new NotImplementedException();
    }

    private Result ValidateProductBlank(ProductBlank blank, out ProductBlank.Validated validatedProduct)
    {
        validatedProduct = null!;

        //TODO это exception 
        if (!blank.Id.HasValue) return Result.Fail("id пуст");

        if (blank.Name.IsNullOrWhiteSpace()) return Result.Fail("Укажите название товара");
        if (blank.Category.IsNullOrWhiteSpace()) return Result.Fail("Укажите категорию товара");
        if (blank.Description.IsNullOrWhiteSpace()) return Result.Fail("Укажите описание товара");

        if (!blank.Price.HasValue) return Result.Fail("Укажите цену");
        //TODO цена не может быть меньше или равна 0

        if (!blank.Weight.HasValue) return Result.Fail("Укажите вес");
        //TODO вес не может быть меньше или равна 0

        if (blank.Image.IsNullOrWhiteSpace()) return Result.Fail("Добавьте фотографию");
        if (blank.Manufacturer.IsNullOrWhiteSpace()) return Result.Fail("Укажите производителя");

        if (!blank.Quantity.HasValue) return Result.Fail("Укажите количество");
        //TODO вес не может быть меньше 0

        if (blank.Status.IsNullOrWhiteSpace()) return Result.Fail("Укажите статус");

        validatedProduct = new ProductBlank.Validated(
            blank.Id.Value!, blank.Name!, blank.Description!, blank.Price.Value!, 
            blank.Category!, blank.Weight.Value!, blank.Manufacturer!, blank.Quantity.Value!,
            blank.Image!, blank.Status!
        );

        return Result.Success();
    }
}
