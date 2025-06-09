using Microsoft.AspNetCore.Mvc;
using musicShopProject.Model.Products;
using musicShopProject.Service;
using musicShopProject.Tools.Types;

namespace musicShopProject.Controllers;

public class ProductController : ControllerBase
{
    private readonly IProductService _productService;
    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpPost("Product/Save")]
    public Result SaveProduct([FromBody] ProductBlank blank)
    {
        return _productService.AddProduct(blank, Guid.NewGuid());
    }

    [HttpGet("Products/Get/All")]
    public Product[] GetProducts([FromQuery] Guid? categoryId)
    {
        return _productService.GetProducts(categoryId);
    }

    [HttpGet("Products/Search")]
    public Product[] GetProducts([FromQuery] String? searchText)
    {
        return _productService.GetProducts(searchText);
    }

    [HttpGet("Product/Get")]
    public Product? GetProduct([FromQuery] Guid productId)
    {
        return _productService?.GetProduct(productId);
    }
}
