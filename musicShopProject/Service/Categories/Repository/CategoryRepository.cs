using musicShopProject.Model.Categories;
using musicShopProject.Service.Categories.Repository.Converters;
using musicShopProject.Service.Categories.Repository.Models;
using musicShopProject.Tools.DataBase.Interfaces;
using Npgsql;

namespace musicShopProject.Service.Categories.Repository;

public class CategoryRepository : ICategoryRepository
{
    private readonly IMainConnector _mainConnector;
    public CategoryRepository(IMainConnector mainConnector)
    {
        _mainConnector = mainConnector;
    }
    public void SaveCategory(CategoryBlank.Validated validatedBlank, Guid requestedUserId)
    {
        String query = @"INSERT INTO categories (
                       id, name, isremoved, createddatetimeutc, modifieddatetimeutc, 
                       createduserid, modifieduserid
                       )
                       VALUES ( @p_id, @p_name, false, @p_datetime, null, @p_userid, null) 
                       ON CONFLICT (id) 
                       DO UPDATE SET 
                       name = @p_name, 
                       modifieddatetimeutc = @p_datetime, 
                       modifieduserid = @p_userid";

        NpgsqlParameter[] parameters =
        {
            new("p_id", validatedBlank.Id),
            new("p_name", validatedBlank.Name),
            new("p_datetime", DateTime.UtcNow),
            new("p_userid", requestedUserId)
        };

        _mainConnector.ExecuteNonQuery(query, parameters);
    }

    public Category[] GetAllCategories()
    {
        String query = @"SELECT * FROM categories";

        Category[] categories = _mainConnector.GetAllArray<CategoryDB>(query).Select(c => c.ToCategory()).ToArray();

        return categories;
    }
}
