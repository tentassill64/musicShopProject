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
        String query = @"INSERT INTO product (
            id, name, description, createdatetime, updatedatetime,
            price, weight,manufacturer, quantity, 
            category, image, status, createddatetimeutc, modifieddatetimeutc, 
            isremoved, ishidden) 
            VALUES (
            @p_id, @p_name, @p_description, @p_datetime, null,
            @p_price, @p_weight, @p_manufacturer, @p_quantity, @p_category,
            @p_image, @p_status, @p_datetimeutc, null, false, true) 
            ON CONFLICT (id) 
            DO UPDATE SET  
            name = @p_name, 
            description = @p_description, 
            updatedatetime = @p_datetime, 
            price = @p_price, 
            weight = @p_weight, 
            manufacturer = @p_manufacturer, 
            quantity = @p_quantity, 
            category = @p_category, 
            image  = @p_image, 
            status = @p_status, 
            modifieddatetimeutc = @p_datetimeutc"; 

        NpgsqlParameter[] parameters =
        {
            new("p_id", blank.Id),
            new("p_name", blank.Name),
            new("p_description", blank.Description),
            new("p_datetime", DateTime.Now),
            new("p_datetimeutc", DateTime.UtcNow),
            new("p_price", blank.Price),
            new("p_weight", blank.Weight),
            new("p_manufacturer", blank.Manufacturer),
            new("p_quantity", blank.Quantity),
            new("p_category",blank.CategoryId),
            new("p_image", blank.Image),
            new("p_status", blank.Status)
        };

        _mainConnector.ExecuteNonQuery(query, parameters);
    }
}
