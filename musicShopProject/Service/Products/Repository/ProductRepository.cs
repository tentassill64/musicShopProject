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
    public void SaveProduct(ProductBlank.Validated blank, Guid requestedUserId)
    {
        String query = @"INSERT INTO products (
            id, name, description, 
            price, weight, manufacturer, quantity, 
            categoryid, images, status, createddatetimeutc, modifieddatetimeutc, 
            isremoved, ishidden, createduserid, modifieduserid) 
            VALUES (
            @p_id, @p_name, @p_description, @p_price, @p_weight, 
            @p_manufacturer, @p_quantity, @p_category,
            @p_images, @p_status, @p_datetimeutc, null, false, 
            false, @p_requesteduserid, null
            ) 
            ON CONFLICT (id) 
            DO UPDATE SET  
            name = @p_name, 
            description = @p_description, 
            price = @p_price, 
            weight = @p_weight, 
            manufacturer = @p_manufacturer, 
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
            new("p_manufacturer", blank.Manufacturer),
            new("p_quantity", blank.Quantity),
            new("p_category",blank.CategoryId),
            new("p_images", blank.Images),
            new("p_status", blank.Status),
            new("p_requesteduserid", requestedUserId)
        };

        _mainConnector.ExecuteNonQuery(query, parameters);
    }
}
