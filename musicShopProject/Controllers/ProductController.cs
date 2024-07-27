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

    [HttpPost("product/add")]
    public Result SaveProduct([FromBody] ProductBlank blank)
    {
        return _productService.AddProduct(blank, Guid.Empty);
    }
}
