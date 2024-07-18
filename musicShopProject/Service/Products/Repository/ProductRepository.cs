using musicShopProject.Model.Products;
using musicShopProject.Tools.DataBase.Interfaces;
using Npgsql;

namespace musicShopProject.Service.Products.Repository;

public class ProductRepository : IProductRepository
{
    private readonly IMainConnector _mainConnector;
    public ProductRepository(IMainConnector mainConnector)
    {
        _mainConnector = mainConnector;
    }
    public void SaveProduct(ProductBlank.Validated blank)
    {
        String query = $"INSERT INTO product (" +
            $"id, name, description, createdatetime, updatedatetime, " +
            $"price, weight,manufacturer, quantity, " +
            $"category, image, status)" +
            $"VALUES (" +
            $"@p_id, @p_name, @p_description, @p_createdatetime, null," +
            $"@p_price, @p_weight, @p_manufacturer, @p_quantity, @p_category," +
            $"@p_image, @p_status)" +
            $"ON CONFLICT (id) " +
            $"DO UPDATE SET " +
            $"name = @p_name," +
            $"description = @p_description," +
            $"createdatetime = @p_createdatetime," +
            $"updatedatetime = @p_updatedatetime," +
            $"price = @p_price," +
            $"weight = @p_weight," +
            $"manufacturer = @p_manufacturer," +
            $"quantity = @p_quantity," +
            $"category = @p_category," +
            $"image  = @p_image," +
            $"status = @p_status";

        var parameters = new NpgsqlParameter[]
        {
            new("p_id", blank.Id),
            new("p_name", blank.Name),
            new("p_description", blank.Description),
            new("p_createdatetime", DateTime.UtcNow),
            new("p_updatedatetime", DateTime.UtcNow),
            new("p_price", blank.Price),
            new("p_weight", blank.Weight),
            new("p_manufacturer", blank.Manufacturer),
            new("p_quantity", blank.Quantity),
            new("p_category",blank.Category),
            new("p_image", blank.Image),
            new("p_status", blank.Status)
        };

        _mainConnector.ExecuteNonQuery(query, parameters);
    }
}
