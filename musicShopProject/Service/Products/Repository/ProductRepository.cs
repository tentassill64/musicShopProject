using musicShopProject.Model.Manufacturers;
using musicShopProject.Model.Products;
using musicShopProject.Service.Manufacturers;
using musicShopProject.Service.Products.Repository.Converters;
using musicShopProject.Service.Products.Repository.Models;
using musicShopProject.Tools.DataBase.Interfaces;
using Npgsql;

namespace musicShopProject.Service.Products.Repository;

public class ProductRepository : IProductRepository
{
    private readonly IMainConnector _mainConnector;
    private readonly IManufacturerService _manufacturerService;

    public ProductRepository(IMainConnector mainConnector, IManufacturerService manufacturerService)
    {
        _mainConnector = mainConnector;
        _manufacturerService = manufacturerService;
    }

    public Product[] GetProducts(String searchText)
    {
        String query = "Select * From products WHERE name ILIKE @p_name and isremoved = false";

        NpgsqlParameter[] parameters =
        {
            new("p_name", '%' + searchText + '%' )
        };

        ProductDB[] productDBs = _mainConnector.GetArray<ProductDB>(query, parameters);

        Manufacturer[] manufacturers = _manufacturerService.GetManufacturersBySeatchText(String.Empty);

        return productDBs.Select(product => product.ToProduct(manufacturers.FirstOrDefault(m => m.Id == product.ManufacturerId))).ToArray();
    }

    public void SaveProduct(ProductBlank.Validated blank, Guid requestedUserId)
    {
        String query = @"INSERT INTO products (
            id, name, description, 
            price, weight, manufacturerid, quantity, 
            categoryid, images, status, createddatetimeutc, modifieddatetimeutc, 
            isremoved, ishidden, createduserid, modifieduserid) 
            VALUES (
            @p_id, @p_name, @p_description, @p_price, @p_weight, 
            @p_manufacturerid, @p_quantity, @p_category,
            @p_images, @p_status, @p_datetimeutc, null, false, 
            false, @p_requesteduserid, null
            ) 
            ON CONFLICT (id) 
            DO UPDATE SET  
            name = @p_name, 
            description = @p_description, 
            price = @p_price, 
            weight = @p_weight, 
            manufacturerid = @p_manufacturerid, 
            quantity = @p_quantity, 
            categoryid = @p_category, 
            images  = @p_images, 
            status = @p_status, 
            modifieddatetimeutc = @p_datetimeutc, 
            modifieduserid = @p_requesteduserid";

        NpgsqlParameter[] parameters =
        {
            new("p_id", blank.Id),
            new("p_name", blank.Name),
            new("p_description", blank.Description),
            new("p_datetimeutc", DateTime.UtcNow),
            new("p_price", blank.Price),
            new("p_weight", blank.Weight),
            new("p_manufacturerid", blank.ManufacturerId),
            new("p_quantity", blank.Quantity),
            new("p_category", blank.CategoryId),
            new("p_images", blank.Images),
            new("p_status", blank.Status),
            new("p_requesteduserid", requestedUserId)
        };

        _mainConnector.ExecuteNonQuery(query, parameters);
    }

    public Product[] GetProducts()
    {
        String query = @"SELECT * FROM products";

        Manufacturer[] manufacturers = _manufacturerService.GetManufacturersBySeatchText(String.Empty);

        return _mainConnector.GetArray<ProductDB>(query)
             .Select(product => product.ToProduct(manufacturers.FirstOrDefault(m => m.Id == product.ManufacturerId))).ToArray();
    }

    public Product[] GetProducts(Guid? categoryId = null)
    {
        String query = @"SELECT * FROM products
                 WHERE (COALESCE(@p_categoryid::uuid, categoryid::uuid) = categoryid::uuid)";

        NpgsqlParameter[] parameters =
        {
            new("p_categoryid", categoryId)
        };

        Manufacturer[] manufacturers = _manufacturerService.GetManufacturersBySeatchText(String.Empty);

        return _mainConnector.GetArray<ProductDB>(query, parameters)
            .Select(product => product.ToProduct(manufacturers.FirstOrDefault(m => m.Id == product.ManufacturerId))).ToArray();
    }

    public Product? GetProduct(Guid productId)
    {
        String query = @"SELECT * FROM products
                 WHERE id = @p_productid";

        NpgsqlParameter[] parameters =
        {
            new("p_productid", productId)
        };

        ProductDB productDB = _mainConnector.Get<ProductDB>(query, parameters);

        Manufacturer manufacturer = _manufacturerService.GetManufacturerById(productDB.ManufacturerId);

        return productDB.ToProduct(manufacturer);
    }
}